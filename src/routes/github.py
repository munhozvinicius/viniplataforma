import os
import json
import base64
import requests
from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin

github_bp = Blueprint('github', __name__)

@github_bp.route('/commit', methods=['POST'])
@cross_origin()
def auto_commit():
    """
    Endpoint para fazer commit automático no GitHub
    """
    try:
        data = request.get_json()
        
        # Validar dados obrigatórios
        required_fields = ['github_token', 'repo_owner', 'repo_name', 'files', 'commit_message']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Campo obrigatório ausente: {field}'}), 400
        
        github_token = data['github_token']
        repo_owner = data['repo_owner']
        repo_name = data['repo_name']
        files = data['files']  # Lista de arquivos: [{'path': 'arquivo.json', 'content': {...}}]
        commit_message = data['commit_message']
        branch = data.get('branch', 'main')
        
        # Headers para autenticação
        headers = {
            'Authorization': f'token {github_token}',
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        }
        
        # 1. Obter referência da branch
        ref_url = f'https://api.github.com/repos/{repo_owner}/{repo_name}/git/refs/heads/{branch}'
        ref_response = requests.get(ref_url, headers=headers)
        
        if ref_response.status_code != 200:
            return jsonify({'error': 'Erro ao obter referência da branch', 'details': ref_response.text}), 400
        
        ref_data = ref_response.json()
        base_sha = ref_data['object']['sha']
        
        # 2. Obter tree base
        tree_url = f'https://api.github.com/repos/{repo_owner}/{repo_name}/git/trees/{base_sha}'
        tree_response = requests.get(tree_url, headers=headers)
        
        if tree_response.status_code != 200:
            return jsonify({'error': 'Erro ao obter tree base', 'details': tree_response.text}), 400
        
        # 3. Criar blobs para cada arquivo
        blobs = []
        for file_info in files:
            file_path = file_info['path']
            file_content = json.dumps(file_info['content'], indent=2, ensure_ascii=False)
            
            # Criar blob
            blob_data = {
                'content': base64.b64encode(file_content.encode('utf-8')).decode('utf-8'),
                'encoding': 'base64'
            }
            
            blob_url = f'https://api.github.com/repos/{repo_owner}/{repo_name}/git/blobs'
            blob_response = requests.post(blob_url, headers=headers, json=blob_data)
            
            if blob_response.status_code != 201:
                return jsonify({'error': f'Erro ao criar blob para {file_path}', 'details': blob_response.text}), 400
            
            blob_sha = blob_response.json()['sha']
            blobs.append({
                'path': file_path,
                'mode': '100644',
                'type': 'blob',
                'sha': blob_sha
            })
        
        # 4. Criar nova tree
        new_tree_data = {
            'base_tree': base_sha,
            'tree': blobs
        }
        
        new_tree_url = f'https://api.github.com/repos/{repo_owner}/{repo_name}/git/trees'
        new_tree_response = requests.post(new_tree_url, headers=headers, json=new_tree_data)
        
        if new_tree_response.status_code != 201:
            return jsonify({'error': 'Erro ao criar nova tree', 'details': new_tree_response.text}), 400
        
        new_tree_sha = new_tree_response.json()['sha']
        
        # 5. Criar commit
        commit_data = {
            'message': commit_message,
            'tree': new_tree_sha,
            'parents': [base_sha]
        }
        
        commit_url = f'https://api.github.com/repos/{repo_owner}/{repo_name}/git/commits'
        commit_response = requests.post(commit_url, headers=headers, json=commit_data)
        
        if commit_response.status_code != 201:
            return jsonify({'error': 'Erro ao criar commit', 'details': commit_response.text}), 400
        
        commit_sha = commit_response.json()['sha']
        
        # 6. Atualizar referência da branch
        update_ref_data = {
            'sha': commit_sha
        }
        
        update_ref_url = f'https://api.github.com/repos/{repo_owner}/{repo_name}/git/refs/heads/{branch}'
        update_ref_response = requests.patch(update_ref_url, headers=headers, json=update_ref_data)
        
        if update_ref_response.status_code != 200:
            return jsonify({'error': 'Erro ao atualizar referência da branch', 'details': update_ref_response.text}), 400
        
        # 7. Verificar se o Vercel vai fazer deploy automaticamente
        # (O Vercel detecta automaticamente commits na branch principal)
        
        return jsonify({
            'success': True,
            'message': 'Commit realizado com sucesso!',
            'commit_sha': commit_sha,
            'commit_url': f'https://github.com/{repo_owner}/{repo_name}/commit/{commit_sha}',
            'vercel_deploy': 'O Vercel deve iniciar o deploy automaticamente em alguns segundos.'
        })
        
    except Exception as e:
        return jsonify({'error': 'Erro interno do servidor', 'details': str(e)}), 500

@github_bp.route('/status/<repo_owner>/<repo_name>', methods=['GET'])
@cross_origin()
def check_repo_status(repo_owner, repo_name):
    """
    Endpoint para verificar o status do repositório
    """
    try:
        github_token = request.headers.get('Authorization', '').replace('Bearer ', '')
        
        if not github_token:
            return jsonify({'error': 'Token do GitHub não fornecido'}), 401
        
        headers = {
            'Authorization': f'token {github_token}',
            'Accept': 'application/vnd.github.v3+json'
        }
        
        # Verificar se o repositório existe e está acessível
        repo_url = f'https://api.github.com/repos/{repo_owner}/{repo_name}'
        repo_response = requests.get(repo_url, headers=headers)
        
        if repo_response.status_code != 200:
            return jsonify({'error': 'Repositório não encontrado ou sem acesso', 'details': repo_response.text}), 404
        
        repo_data = repo_response.json()
        
        # Obter último commit
        commits_url = f'https://api.github.com/repos/{repo_owner}/{repo_name}/commits'
        commits_response = requests.get(commits_url, headers=headers, params={'per_page': 1})
        
        last_commit = None
        if commits_response.status_code == 200:
            commits_data = commits_response.json()
            if commits_data:
                last_commit = {
                    'sha': commits_data[0]['sha'],
                    'message': commits_data[0]['commit']['message'],
                    'date': commits_data[0]['commit']['author']['date'],
                    'author': commits_data[0]['commit']['author']['name']
                }
        
        return jsonify({
            'success': True,
            'repo_name': repo_data['name'],
            'repo_full_name': repo_data['full_name'],
            'default_branch': repo_data['default_branch'],
            'last_commit': last_commit,
            'repo_url': repo_data['html_url']
        })
        
    except Exception as e:
        return jsonify({'error': 'Erro interno do servidor', 'details': str(e)}), 500

