pipeline {
    agent any

    tools {
        maven 'Maven-3.8'
        nodejs 'NodeJS-18'
    }

environment {
    AWS_HOST    = '3.36.77.69'
    AWS_USER    = 'ubuntu'          // ec2-user → ubuntu 로 변경!
    DEPLOY_PATH = '/var/lib/tomcat10/webapps'  // 경로 수정!
    SSH_KEY     = credentials('aws-ec2-key')
}
    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Vue 빌드') {
            steps {
                dir('src/main/frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Maven 빌드') {
            steps {
                sh 'mvn clean package -DskipTests'
            }
        }

        stage('AWS 배포') {
            steps {
                sh """
                    scp -i ${SSH_KEY} -o StrictHostKeyChecking=no \
                    target/*.war \
                    ${AWS_USER}@${AWS_HOST}:${DEPLOY_PATH}/ROOT.war
                """
                sh """
                    ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no \
                    ${AWS_USER}@${AWS_HOST} \
                    'sudo systemctl restart tomcat'
                """
            }
        }
    }

    post {
        success {
            echo '✅ 배포 성공!'
        }
        failure {
            echo '❌ 배포 실패!'
        }
    }
}