class DataVisualization {
    constructor() {
        this.initRadarChart();
        this.initProgressRings();
        this.initGithubContributions();
        this.initDataStream();
    }

    initRadarChart() {
        const ctx = document.getElementById('skillRadar')?.getContext('2d');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['JavaScript', 'React', 'Node.js', 'Python', 'HTML/CSS', 'Database'],
                datasets: [{
                    label: 'Skill Level',
                    data: [90, 85, 80, 75, 95, 85],
                    backgroundColor: 'rgba(0, 48, 135, 0.2)',
                    borderColor: 'rgba(0, 48, 135, 0.8)',
                    pointBackgroundColor: '#DAAA00',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(0, 48, 135, 1)'
                }]
            },
            options: {
                elements: {
                    line: {
                        tension: 0.3
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20
                        },
                        grid: {
                            color: 'rgba(0, 48, 135, 0.1)'
                        },
                        angleLines: {
                            color: 'rgba(0, 48, 135, 0.1)'
                        },
                        pointLabels: {
                            font: {
                                size: 14,
                                family: 'Inter'
                            }
                        }
                    }
                }
            }
        });
    }

    initProgressRings() {
        document.querySelectorAll('.progress-ring').forEach(ring => {
            this.createProgressRing(ring);
        });
    }

    createProgressRing(container) {
        const progress = container.dataset.progress || 0;
        const radius = 58;
        const circumference = radius * 2 * Math.PI;
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.classList.add('progress-ring__circle');
        circle.setAttribute('stroke-dasharray', `${circumference} ${circumference}`);
        circle.setAttribute('stroke-dashoffset', circumference - (progress / 100) * circumference);
        
        // 将圆圈添加到SVG中
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.appendChild(circle);
        container.appendChild(svg);
    }

    initGithubContributions() {
        const container = document.querySelector('.github-contributions');
        if (!container) return;

        // 模拟GitHub贡献数据
        const contributions = this.generateMockContributions();
        this.renderContributions(container, contributions);
    }

    initDataStream() {
        const stream = document.querySelector('.data-stream');
        if (!stream) return;

        setInterval(() => {
            this.addDataPoint(stream);
        }, 200);
    }

    // 辅助方法
    generateMockContributions() {
        return Array.from({ length: 364 }, () => 
            Math.floor(Math.random() * 4)
        );
    }

    renderContributions(container, data) {
        data.forEach(value => {
            const day = document.createElement('div');
            day.className = 'contribution-day';
            day.style.backgroundColor = this.getContributionColor(value);
            container.appendChild(day);
        });
    }

    getContributionColor(value) {
        const colors = [
            'rgba(74, 93, 128, 0.1)',
            'rgba(74, 93, 128, 0.4)',
            'rgba(74, 93, 128, 0.7)',
            'rgba(74, 93, 128, 1)'
        ];
        return colors[value];
    }

    addDataPoint(stream) {
        const point = document.createElement('div');
        point.className = 'data-point animate-data-flow';
        stream.appendChild(point);
        
        setTimeout(() => {
            point.remove();
        }, 2000);
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new DataVisualization();
});
