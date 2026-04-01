from flask import Flask, render_template, request, jsonify, g
from flask_cors import CORS
import redis
import os
import json
import socket

app = Flask(__name__, static_folder="public", static_url_path="")
CORS(app)

def get_redis():
    if "redis" not in g:
        g.redis = redis.Redis(
            host=os.getenv("REDIS_HOST", "redis"),
            port=int(os.getenv("REDIS_PORT", 6379)),
            decode_responses=True,
        )
    return g.redis

QUESTIONS = [
    {
        "id": "q1",
        "question": "Mejor lenguaje para DevOps?",
        "options": ["Python", "Go", "Bash", "TypeScript"],
        "emoji": ["🐍", "🐹", "💻", "📘"],
    },
    {
        "id": "q2",
        "question": "Mejor orquestador de contenedores?",
        "options": ["Kubernetes", "Docker Swarm", "Nomad", "ECS"],
        "emoji": ["☸️", "🐳", "📦", "☁️"],
    },
    {
        "id": "q3",
        "question": "Mejor herramienta de IaC?",
        "options": ["Terraform", "Pulumi", "CloudFormation", "Ansible"],
        "emoji": ["🏗️", "🔧", "☁️", "🤖"],
    },
    {
        "id": "q4",
        "question": "Mejor CI/CD?",
        "options": ["GitHub Actions", "GitLab CI", "Jenkins", "ArgoCD"],
        "emoji": ["🐙", "🦊", "🎩", "🐙"],
    },
]


@app.route("/")
def index():
    return app.send_static_file("index.html")


@app.route("/api/questions")
def questions():
    return jsonify(QUESTIONS)


@app.route("/api/vote", methods=["POST"])
def vote():
    data = request.get_json()
    question_id = data.get("question_id")
    option = data.get("option")
    voter_id = data.get("voter_id", socket.gethostname())

    if not question_id or not option:
        return jsonify({"error": "question_id and option required"}), 400

    r = get_redis()
    vote_data = json.dumps(
        {"question_id": question_id, "option": option, "voter_id": voter_id}
    )
    r.rpush("votes", vote_data)
    r.hincrby(f"results:{question_id}", option, 1)

    return jsonify({"success": True})


@app.route("/api/results")
def results():
    r = get_redis()
    all_results = {}
    for q in QUESTIONS:
        qid = q["id"]
        raw = r.hgetall(f"results:{qid}")
        all_results[qid] = {k: int(v) for k, v in raw.items()}
    return jsonify(all_results)


@app.route("/health")
def health():
    return jsonify({"status": "ok", "service": "quizbattle-vote"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)))
