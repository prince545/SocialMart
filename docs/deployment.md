# SocialMart Deployment Guide

This guide covers deploying SocialMart to AWS EC2, setting up a domain with HTTPS, and recommended monitoring.

## 1. AWS EC2 Deployment (Docker Compose)

### Prerequisites
- AWS Account
- Domain Name (optional but recommended)

### Steps
1.  **Launch Instance**:
    - Go to AWS EC2 Console > Launch Instance.
    - OS: Ubuntu Server 22.04 LTS.
    - Instance Type: t2.micro (free tier) or t3.small (recommended).
    - Key Pair: Create a new one (e.g., `socialmart-key.pem`) and download it.
    - Security Group: Allow SSH (22), HTTP (80), HTTPS (443), and custom TCP (5000, 5173).

2.  **Connect to Instance**:
    ```bash
    chmod 400 socialmart-key.pem
    ssh -i "socialmart-key.pem" ubuntu@<EC2-PUBLIC-IP>
    ```

3.  **Install Docker & Docker Compose**:
    ```bash
    sudo apt update
    sudo apt install docker.io docker-compose -y
    sudo usermod -aG docker $USER
    # Log out and back in for group changes to take effect
    exit
    ssh -i "socialmart-key.pem" ubuntu@<EC2-PUBLIC-IP>
    ```

4.  **Deploy Code**:
    - **Option A (Git)**:
        ```bash
        git clone https://github.com/your-username/socialmart.git
        cd socialmart
        ```
    - **Option B (SCP)**:
        ```bash
        # From your local machine
        scp -i "socialmart-key.pem" -r ./pro/* ubuntu@<EC2-PUBLIC-IP>:~/socialmart
        ```

5.  **Run Application**:
    ```bash
    cd socialmart
    # Create .env file if not present
    nano server/.env # Paste your env vars
    docker-compose up -d --build
    ```

## 2. Domain & HTTPS Setup (Nginx + Certbot)

It is highly recommended to use a reverse proxy like Nginx to handle traffic on ports 80/443.

1.  **Install Nginx**:
    ```bash
    sudo apt install nginx -y
    ```
2.  **Configure Nginx**:
    ```bash
    sudo nano /etc/nginx/sites-available/socialmart
    ```
    Add configuration to proxy `socialmart.com` to `localhost:5173` (Frontend) and `api.socialmart.com` to `localhost:5000` (Backend).
3.  **Enable Site**:
    ```bash
    sudo ln -s /etc/nginx/sites-available/socialmart /etc/nginx/sites-enabled/
    sudo systemctl restart nginx
    ```
4.  **SSL with Certbot**:
    ```bash
    sudo apt install certbot python3-certbot-nginx -y
    sudo certbot --nginx -d socialmart.com -d api.socialmart.com
    ```

## 3. Monitoring & Maintenance

### Basic Monitoring
- **Docker Stats**: Run `docker stats` to see CPU/Memory usage.
- **Logs**: Run `docker-compose logs -f` to tail logs.

### Advanced Monitoring
- **Prometheus + Grafana**:
    - Add `prometheus` and `grafana` services to `docker-compose.yml`.
    - Configure Prometheus to scrape metrics from your Node.js app (using `prom-client`).
- **Uptime Robot**: Set up a free external ping to `https://socialmart.com` to get alerted if it goes down.
