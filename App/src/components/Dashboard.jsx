import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import useSession from '../useSessions';
import axios from 'axios';

function Dashboard(){
    const [question, setQuestion] = useState("")
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const { startSession } = useSession();
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationId;
        
        // Set canvas size
        const resizeCanvas = () => {
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            
            canvas.style.width = window.innerWidth + 'px';
            canvas.style.height = window.innerHeight + 'px';
            
            ctx.scale(dpr, dpr);
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('orientationchange', resizeCanvas);

        // Particle system
        const particles = [];
        
        const getParticleCount = () => Math.max(30, Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 15000)));
        const getMaxDistance = () => Math.min(150, Math.max(80, window.innerWidth / 8));

        // Create particles based on screen size
        const initParticles = () => {
            particles.length = 0;
            const particleCount = getParticleCount();
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    size: Math.random() * 1.5 + 0.8
                });
            }
        };

        initParticles();

        // Animation loop
        const animate = () => {
            const dpr = window.devicePixelRatio || 1;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const currentMaxDistance = getMaxDistance();
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            // Update and draw particles
            particles.forEach(particle => {
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Bounce off edges
                if (particle.x < 0 || particle.x > screenWidth) particle.vx *= -1;
                if (particle.y < 0 || particle.y > screenHeight) particle.vy *= -1;

                // Keep within bounds
                particle.x = Math.max(0, Math.min(screenWidth, particle.x));
                particle.y = Math.max(0, Math.min(screenHeight, particle.y));

                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = '#4a90e2';
                ctx.fill();
            });

            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < currentMaxDistance) {
                        const opacity = (currentMaxDistance - distance) / currentMaxDistance * 0.25;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(74, 144, 226, ${opacity})`;
                        ctx.lineWidth = 0.4;
                        ctx.stroke();
                    }
                }
            }

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('orientationchange', resizeCanvas);
            cancelAnimationFrame(animationId);
        };
    }, []);

    async function onSubmit(e) {
        if(!currentUser){
            navigate("/login");
        } else {
            e.preventDefault();
            try {
                const response = await axios.post("http://127.0.0.1:8000/add_question", {
                    user: currentUser.uid,
                    question: question,
                });
            } catch (error) {
                console.log("couldn't add question`")
                console.log(error)
            }
            startSession(question);
            navigate("/interviewSpace", { state: { question } });
        }
    }

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-950 font-sans p-5 box-border overflow-hidden">
            {/* Animated Background Canvas */}
            <canvas
                ref={canvasRef}
                className="fixed inset-0 w-full h-full pointer-events-none"
                style={{ 
                    zIndex: 0,
                    top: 0,
                    left: 0
                }}
            />
            
            {/* Content Overlay */}
            <div className="relative z-10 flex flex-col items-center">
                <style>{`
                    @keyframes typing {
                        from { width: 0; }
                        to { width: 100%; }
                    }
                    .typing-animation {
                        white-space: nowrap;
                        overflow: hidden;
                        width: 0;
                        animation: typing 3s steps(30, end) forwards;
                    }
                    .typing-animation-delayed {
                        white-space: nowrap;
                        overflow: hidden;
                        width: 0;
                        animation: typing 3s steps(25, end) forwards;
                        animation-delay: 3.2s;
                    }
                `}</style>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-400 text-center leading-relaxed mb-4 typing-animation">
                    Ready to ace your next coding interview ?
                </h1>
                <h2 className="text-xl md:text-2xl lg:text-4xl font-light text-white -mt-1 text-center leading-relaxed mb-10 typing-animation-delayed">
                    Built to prepare you for your next coding interview.
                </h2>
                
                <div className="mt-10">
                    <form onSubmit={onSubmit}>
                        <input 
                            type="text" 
                            placeholder="Enter your interview question here" 
                            required
                            onChange={(e) => setQuestion(e.target.value)}
                            className="w-96 md:w-[550px] min-h-[40px] px-4 py-5 rounded-xl border-2 border-gray-700 bg-white text-gray-900 text-lg font-medium outline-none transition-all duration-300 ease-in-out focus:border-blue-400 focus:shadow-[0_0_12px_rgba(88,166,255,0.7)] focus:scale-105 block box-border backdrop-blur-sm"
                        />
                        <button className="mt-6 block mx-auto w-40 py-3.5 border-none rounded-lg bg-gradient-to-br from-green-600 to-green-500 text-white font-bold text-lg cursor-pointer transition-all duration-300 ease-in-out hover:from-green-500 hover:to-green-400 hover:-translate-y-1 hover:scale-105 backdrop-blur-sm">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;