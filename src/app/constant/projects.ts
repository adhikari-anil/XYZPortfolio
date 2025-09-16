export interface Project {
  id: string;
  name: string;
  description: string;
  tech: string[];
  liveUrl: string;
  githubUrl: string;
  github1sUrl: string;
  sourcegraphUrl: string;
  owner: string;
  repo: string;
}

export interface TerminalLine {
  type: "command" | "output" | "error" | "success";
  content: string;
  timestamp?: Date;
}

export const projects: Project[] = [
  {
    id: "instantshare",
    name: "InstantShare - P2P File Sharing Platform",
    description: "Peer-to-peer file sharing platform with real-time transfers",
    tech: ["React", "Node.js", "WebRTC", "Socket.io", "Express"],
    liveUrl: "https://instantshare-demo.vercel.app",
    githubUrl: "https://github.com/adhikari-anil/InstantShare",
    github1sUrl: "https://github1s.com/adhikari-anil/InstantShare",
    sourcegraphUrl:
      "https://sourcegraph.com/github.com/adhikari-anil/InstantShare",
    owner: "adhikari-anil",
    repo: "InstantShare",
  },
  {
    id: "Tracking System",
    name: "Location tracking Platform",
    description: "A simple tracking system.",
    tech: ["Nodejs", "HTML", "CSS"],
    liveUrl: "https://ecommerce-demo.vercel.app",
    githubUrl: "https://github.com/adhikari-anil/TrackingSystem",
    github1sUrl: "https://github1s.com/adhikari-anil/TrackingSystem",
    sourcegraphUrl:
      "https://sourcegraph.com/github.com/adhikari-anil/TrackingSystem",
    owner: "adhikari-anil",
    repo: "TrackingSystem",
  },
  {
    id: "paisakarobarnepal",
    name: "Simple Fund Transfer Application",
    description: "Real-time fund transfer and live money update.",
    tech: ["React", "NodeJs", "SEE(Server-Sent Events)", "MongoDB"],
    liveUrl: "https://karobarnepal.vercel.app/",
    githubUrl: "https://github.com/adhikari-anil/PaisaKarobarNepal",
    github1sUrl: "https://github1s.com/adhikari-anil/PaisaKarobarNepal",
    sourcegraphUrl:
      "https://sourcegraph.com/github.com/adhikari-anil/PaisaKarobarNepal",
    owner: "adhikari-anil",
    repo: "paisakarobarnepal",
  },
  {
    id: "generateimagewithai",
    name: "Image Generation App",
    description: "Real-time Image Generation Application",
    tech: ["React", "Node.js", "Socket.io", "MongoDB"],
    liveUrl: "https://mindframeai.vercel.app/",
    githubUrl: "https://github.com/adhikari-anil/GenerateImageWithMe",
    github1sUrl: "https://github1s.com/adhikari-anil/GenerateImageWithMe",
    sourcegraphUrl:
      "https://sourcegraph.com/github.com/adhikari-anil/GenerateImageWithMe",
    owner: "adhikari-anil",
    repo: "generateimagewithme",
  },
];

export const commands = {
  help: {
    description: "Show available commands",
    action: () => [
      "Available commands:",
      "",
      "  about      - Learn about me",
      "  skills     - View my technical skills",
      "  projects   - See my projects",
      "  listproject  - List of ID of Projects ",
      "  contact    - Get my contact information",
      "  clear      - Clear the terminal",
      "  help       - Show this help message",
      "  code       - Open integrated code viewer",
      "  browse     - Browse code externally (GitHub1s)",
      "",
      "💡 Try 'code <project-id>' for integrated VS Code experience!",
    ],
  },
  about: {
    description: "Learn about me",
    action: () => [
      "👋 Hello! I'm a passionate developer",
      "",
      "I'm a full-stack developer with a love for creating",
      "innovative solutions and beautiful user experiences.",
      "I enjoy working with modern technologies and am always",
      "eager to learn new things and take on challenging projects.",
    ],
  },
  skills: {
    description: "View my technical skills",
    action: () => [
      "🛠️  Technical Skills:",
      "",
      "Frontend:",
      "  • React.js & Next.js",
      "  • TypeScript & JavaScript",
      "  • WebRTC",
      "  • HTML5 & CSS3",
      "  • Tailwind CSS",
      "",
      "Backend:",
      "  • Node.js & Express",
      "  • PostgreSQL & MongoDB",
      "  • WebSocket",
      "  • REST APIs",
    ],
  },
  projects: {
    description: "See my projects with live demos",
    action: () => [
      "🚀 Featured Projects:",
      "",
      ...projects.flatMap((project, index) => [
        `${index + 1}. ${project.name}`,
        `   • ${project.description}`,
        `   • Tech: ${project.tech.join(", ")}`,
        `   • Live Demo: ${project.liveUrl}`,
        `   • GitHub: ${project.githubUrl}`,
        `   • Commands: 'code ${project.id}' (integrated) or 'browse ${project.id}' (external)`,
        "",
      ]),
      "💡 Use 'code <project-id>' for integrated VS Code experience!",
    ],
  },
  listproject: {
    description: "List of ID of Projects",
    action: () => [
      "Project Id for Quick Code Overview",
      "",
      ...projects.flatMap((project, index) => [
        `${index + 1}. ${project.name}`,
        `   • ID: ${project.id}`,
      ]),
      "💡 Use 'code <project-id>' for integrated VS Code experience!",
    ],
  },
  contact: {
    description: "Get my contact information",
    action: () => [
      "📧 Let's Connect:",
      "",
      "Email: adhikarianil719@gmail.com",
      "GitHub: github.com/adhikari-anil",
      "LinkedIn: https://www.linkedin.com/in/anil-adhikari-833973298/",
      "Twitter: @AnilAdh25412744",
      "",
      "Feel free to reach out! 👋",
    ],
  },
  clear: {
    description: "Clear the terminal",
    action: () => [],
  },
};

export interface GitHubFile {
  name: string;
  path: string;
  type: "file" | "dir";
  download_url?: string;
  size?: number;
}
