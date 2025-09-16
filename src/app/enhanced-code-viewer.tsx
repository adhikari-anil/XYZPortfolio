"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Cat, Folder, File, Search, Star } from "lucide-react";
import { GitHubFile, Project } from "./constant/projects";

interface EnhancedCodeViewerProps {
  project: Project;
}

export default function EnhancedCodeViewer({
  project,
}: EnhancedCodeViewerProps) {
  const [files, setFiles] = useState<GitHubFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [fileContent, setFileContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [repoStats, setRepoStats] = useState<any>(null);

  const fetchRepoStats = useCallback(async () => {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${project.owner}/${project.repo}`
      );
      if (response.ok) {
        const stats = await response.json();
        setRepoStats(stats);
      }
    } catch (error) {
      console.error("Error fetching repo stats:", error);
    }
  }, [project.owner, project.repo]);

  const fetchFiles = useCallback(
    async (path: string) => {
      try {
        setLoading(true);
        const url = `https://api.github.com/repos/${project.owner}/${project.repo}/contents/${path}`;
        const response = await fetch(url);

        if (response.ok) {
          const data = await response.json();
          setFiles(Array.isArray(data) ? data : [data]);
          setCurrentPath(path);
        } else {
          // Fallback sample files
          setFiles([
            {
              name: "README.md",
              path: "README.md",
              type: "file",
              download_url: "",
              size: 1024,
            },
            {
              name: "package.json",
              path: "package.json",
              type: "file",
              download_url: "",
              size: 512,
            },
            { name: "src", path: "src", type: "dir" },
            { name: "public", path: "public", type: "dir" },
            {
              name: ".gitignore",
              path: ".gitignore",
              type: "file",
              download_url: "",
              size: 256,
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching files:", error);
        setFiles([
          {
            name: "README.md",
            path: "README.md",
            type: "file",
            download_url: "",
            size: 1024,
          },
          {
            name: "package.json",
            path: "package.json",
            type: "file",
            download_url: "",
            size: 512,
          },
          { name: "src", path: "src", type: "dir" },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [project.owner, project.repo]
  );

  useEffect(() => {
    fetchRepoStats();
    fetchFiles("");
  }, [fetchFiles, fetchRepoStats]);

  const fetchFileContent = async (file: GitHubFile) => {
    if (!file.download_url) {
      setFileContent(`// ${file.name}
// This is a preview of the file structure
// For full code access, visit: ${project.github1sUrl}

// Sample content based on file type:
${getSampleContent(file.name)}`);
      return;
    }

    try {
      const response = await fetch(file.download_url);
      if (response.ok) {
        const content = await response.text();
        setFileContent(content);
      } else {
        setFileContent(`// Error loading ${file.name}
// Visit ${project.github1sUrl} for full access`);
      }
    } catch (error) {
      setFileContent(`// Error loading ${file.name}
// Visit ${project.github1sUrl} for full access`);
      console.log("Error form: ", error);
    }
  };

  const getSampleContent = (filename: string) => {
    const extension = filename.split(".").pop();
    switch (extension) {
      case "js":
      case "jsx":
        return `import React from 'react';

export default function Component() {
  return (
    <div>
      <h1>Welcome to ${project.name}</h1>
    </div>
  );
}`;
      case "ts":
      case "tsx":
        return `import React from 'react';

interface Props {
  title: string;
}

export const Component: React.FC<Props> = ({ title }) => {
  return (
    <div>
      <h1>{title}</h1>
    </div>
  );
};`;
      case "json":
        return `{
  "name": "${project.repo}",
  "version": "1.0.0",
  "description": "${project.description}",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}`;
      case "md":
        return `# ${project.name}

${project.description}

## Tech Stack
${project.tech.map((tech) => `- ${tech}`).join("\n")}

## Getting Started
1. Clone the repository
2. Install dependencies
3. Run the development server`;
      default:
        return `// ${filename} content
// This file contains the implementation details
// Visit the GitHub repository for complete source code`;
    }
  };

  const handleFileClick = (file: GitHubFile) => {
    if (file.type === "dir") {
      fetchFiles(file.path);
    } else {
      setSelectedFile(file.path);
      fetchFileContent(file);
    }
  };

  const getFileIcon = (filename: string, type: string) => {
    if (type === "dir") return "📁";
    const extension = filename.split(".").pop();
    switch (extension) {
      case "tsx":
      case "jsx":
        return "⚛️";
      case "ts":
      case "js":
        return "📜";
      case "css":
        return "🎨";
      case "json":
        return "📋";
      case "md":
        return "📖";
      case "html":
        return "🌐";
      case "py":
        return "🐍";
      default:
        return "📄";
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="bg-gray-800 border-gray-700 h-full flex flex-col">
      {/* Header */}
      <div className="bg-gray-700 px-4 py-3 border-b border-gray-600">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-white">{project.name}</h2>
            {repoStats && (
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {repoStats.stargazers_count}
                </span>
                <span>{repoStats.language}</span>
                <span>{formatFileSize(repoStats.size * 1024)}</span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => window.open(project.liveUrl, "_blank")}
              variant="outline"
              size="sm"
              className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Live
            </Button>
            <Button
              onClick={() => window.open(project.github1sUrl, "_blank")}
              variant="outline"
              size="sm"
              className="text-green-400 border-green-400 hover:bg-green-400 hover:text-black"
            >
              <Cat className="w-3 h-3 mr-1" />
              GitHub1s
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:border-blue-400"
          />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* File Explorer */}
        <div className="w-1/3 border-r border-gray-600 flex flex-col">
          <div className="p-3 border-b border-gray-600">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
              <Folder className="w-4 h-4" />
              Files
              {currentPath && (
                <Button
                  onClick={() => fetchFiles("")}
                  variant="ghost"
                  size="sm"
                  className="text-xs text-blue-400 hover:text-blue-300 p-1 h-auto"
                >
                  ← Root
                </Button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-3 text-gray-400 text-sm">Loading files...</div>
            ) : (
              <div className="p-2">
                {filteredFiles.map((file) => (
                  <button
                    key={file.path}
                    onClick={() => handleFileClick(file)}
                    className={`w-full text-left p-2 rounded text-sm flex items-center gap-2 transition-colors ${
                      selectedFile === file.path
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    <span className="text-base">
                      {getFileIcon(file.name, file.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-mono truncate">{file.name}</div>
                      {file.size && (
                        <div className="text-xs text-gray-400">
                          {formatFileSize(file.size)}
                        </div>
                      )}
                    </div>
                    {file.type === "dir" && (
                      <span className="text-gray-500">→</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tech Stack */}
          <div className="p-3 border-t border-gray-600">
            <div className="text-xs font-semibold text-gray-300 mb-2">
              Tech Stack
            </div>
            <div className="flex flex-wrap gap-1">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Code Display */}
        <div className="flex-1 flex flex-col">
          <div className="bg-gray-700 px-4 py-2 border-b border-gray-600 flex items-center gap-2">
            <File className="w-4 h-4 text-gray-400" />
            <span className="font-mono text-sm text-gray-300">
              {selectedFile || "Select a file to view"}
            </span>
            <span className="text-xs text-gray-500 ml-auto">Read Only</span>
          </div>

          <div className="flex-1 overflow-auto bg-gray-900">
            {selectedFile ? (
              <pre className="p-4 text-sm font-mono text-gray-300 whitespace-pre-wrap leading-relaxed">
                <code>{fileContent}</code>
              </pre>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <File className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">
                    Select a file to view its content
                  </p>
                  <p className="text-sm mb-4">
                    Browse the file structure on the left
                  </p>
                  <Button
                    onClick={() => window.open(project.github1sUrl, "_blank")}
                    variant="outline"
                    className="text-green-400 border-green-400 hover:bg-green-400 hover:text-black"
                  >
                    <Cat className="w-4 h-4 mr-2" />
                    Open in GitHub1s for Full Experience
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
