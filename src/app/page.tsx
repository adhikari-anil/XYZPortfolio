"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EnhancedCodeViewer from "./enhanced-code-viewer";
import { Project, projects, TerminalLine, commands } from "./constant/projects";

export default function CLIPortfolio() {
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [history, setHistory] = useState<TerminalLine[]>([]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [viewMode, setViewMode] = useState<"terminal" | "split" | "code">(
    "terminal"
  );
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const welcomeMessage = [
      "Welcome to my CLI Portfolio! 🚀",
      "",
      "Type 'help' to see available commands.",
      "",
    ];

    setHistory(
      welcomeMessage.map((content) => ({
        type: "output" as const,
        content,
        timestamp: new Date(),
      }))
    );
  }, []);

  useEffect(() => {
    if (inputRef.current && viewMode !== "code") {
      inputRef.current.focus();
    }
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history, viewMode]);

  const executeCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const [command, ...args] = trimmedCmd.split(" ");

    setHistory((prev) => [
      ...prev,
      {
        type: "command",
        content: `$ ${cmd}`,
        timestamp: new Date(),
      },
    ]);

    if (command === "clear") {
      setHistory([]);
      return;
    }

    if (command === "") return;

    const commandAction = commands[command as keyof typeof commands];

    if (commandAction) {
      setIsTyping(true);
      await new Promise((resolve) => setTimeout(resolve, 300));

      const output = commandAction.action();
      setHistory((prev) => [
        ...prev,
        ...output.map((content) => ({
          type: "output" as const,
          content,
          timestamp: new Date(),
        })),
      ]);

      setIsTyping(false);
    } else if (command === "code" && args.length > 0) {
      const projectId = args[0];
      const project = projects.find(
        (p) => p.id.toLowerCase() === projectId.toLowerCase()
      );

      if (project) {
        setSelectedProject(project);
        setViewMode("code");
        setHistory((prev) => [
          ...prev,
          {
            type: "success",
            content: `🚀 Opening ${project.name} in integrated code viewer...`,
            timestamp: new Date(),
          },
          {
            type: "output",
            content:
              "💡 Use the view controls to switch between terminal and code!",
            timestamp: new Date(),
          },
        ]);
        return;
      } else {
        setHistory((prev) => [
          ...prev,
          {
            type: "error",
            content: `Project '${projectId}' not found. Available: ${projects
              .map((p) => p.id)
              .join(", ")}`,
            timestamp: new Date(),
          },
        ]);
        return;
      }
    } else if (command === "browse") {
      if (args.length > 0) {
        const projectId = args[0];
        const project = projects.find(
          (p) => p.id.toLowerCase() === projectId.toLowerCase()
        );

        if (project) {
          setHistory((prev) => [
            ...prev,
            {
              type: "output",
              content: `🚀 Opening ${project.name} externally...`,
              timestamp: new Date(),
            },
            {
              type: "success",
              content: "🔓 Launching GitHub1s (no login required)...",
              timestamp: new Date(),
            },
          ]);

          setTimeout(() => {
            window.open(project.github1sUrl, "_blank");
          }, 1000);

          return;
        } else {
          setHistory((prev) => [
            ...prev,
            {
              type: "error",
              content: `Project '${projectId}' not found. Available: ${projects
                .map((p) => p.id)
                .join(", ")}`,
              timestamp: new Date(),
            },
          ]);
          return;
        }
      } else {
        setIsTyping(true);
        await new Promise((resolve) => setTimeout(resolve, 300));

        const output = [
          "Usage: browse <project-id> (external) or code <project-id> (integrated)",
          "",
          "Available projects:",
          ...projects.map((p) => `• ${p.id} - ${p.name}`),
          "",
          `Example: code ${projects[0]?.id || "instantshare"} (integrated)`,
          `Example: browse ${projects[0]?.id || "instantshare"} (external)`,
        ];

        setHistory((prev) => [
          ...prev,
          ...output.map((content) => ({
            type: "output" as const,
            content,
            timestamp: new Date(),
          })),
        ]);

        setIsTyping(false);
        return;
      }
    } else {
      setHistory((prev) => [
        ...prev,
        {
          type: "error",
          content: `Command not found: ${trimmedCmd}. Type 'help' for available commands.`,
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(currentInput);
      if (cmdHistory.includes(currentInput) === false) {
        setCmdHistory((prev) => [...prev, currentInput]);
      }
      setCurrentInput("");
      setHistoryIndex(null);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const availableCommands = Object.keys(commands);
      const matches = availableCommands.filter((cmd) =>
        cmd.startsWith(currentInput.toLowerCase())
      );
      if (matches.length === 1) {
        setCurrentInput(matches[0]);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        setHistoryIndex((prevIndex) => {
          const newIndex =
            prevIndex === null
              ? cmdHistory.length - 1
              : Math.max(prevIndex - 1, 0);
          setCurrentInput(cmdHistory[newIndex]);
          return newIndex;
        });
      }
      console.log("previous commands: ", cmdHistory);
      setCurrentInput(cmdHistory[cmdHistory.length - 1]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== null) {
        setHistoryIndex((prevIndex) => {
          const safePrevIndex = prevIndex !== null ? prevIndex : 0;
          const newIndex = Math.min(safePrevIndex + 1, cmdHistory.length - 1);
          setCurrentInput(cmdHistory[newIndex]);
          return newIndex;
        });
      }
    }
  };

  const renderTerminal = () => (
    <Card className="bg-gray-900 border-gray-700 shadow-2xl h-full">
      <div className="p-6 h-full flex flex-col">
        {/* Terminal Header */}
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-700">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="ml-4 text-gray-400">portfolio@terminal:~$</span>
          <span className="ml-auto text-xs text-green-500">
            🔓 No Login Required
          </span>
        </div>

        {/* Terminal Content */}
        <div
          ref={terminalRef}
          className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 mb-4"
        >
          {history.map((line, index) => (
            <div key={index} className="mb-1">
              <span
                className={`${
                  line.type === "command"
                    ? "text-cyan-400"
                    : line.type === "error"
                    ? "text-red-400"
                    : line.type === "success"
                    ? "text-lime-400"
                    : "text-green-400"
                }`}
              >
                {line.content}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="text-yellow-400">
              <span className="animate-pulse">Typing...</span>
            </div>
          )}

          {/* Current Input Line */}
          <div className="flex items-center mt-2">
            <span className="text-cyan-400 mr-2">$</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent border-none outline-none text-green-400 flex-1 font-mono"
              placeholder="Type a command..."
              disabled={isTyping}
            />
            <span className="animate-pulse text-green-400">|</span>
          </div>
        </div>

        {/* Command Suggestions */}
        <div className="pt-4 border-t border-gray-700">
          <div className="text-gray-500 text-sm">
            Quick commands:{" "}
            {Object.keys(commands).map((cmd, index) => (
              <span key={cmd}>
                <button
                  onClick={() => setCurrentInput(cmd)}
                  className="text-cyan-400 hover:text-cyan-300 underline"
                >
                  {cmd}
                </button>
                {index < Object.keys(commands).length - 1 && " • "}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-black text-green-400 p-4 font-mono">
      {/* View Mode Controls */}
      {selectedProject && (
        <div className="max-w-7xl mx-auto mb-4">
          <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300">
                Viewing: {selectedProject.name}
              </span>
            </div>
            <Button
              onClick={() => {
                setSelectedProject(null);
                setViewMode("terminal");
              }}
              variant="ghost"
              size="sm"
              className="text-red-400 hover:text-red-300"
            >
              Close Project
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* {viewMode === "terminal" && (
          <div className="max-w-4xl mx-auto">{renderTerminal()}</div>
        )} */}

        {/* {viewMode === "split" && selectedProject && (
          <div className="grid grid-cols-2 gap-4 h-[calc(100vh-140px)]">
            <div>{renderTerminal()}</div>
            <div>
              <EnhancedCodeViewer project={selectedProject} />
            </div>
          </div>
        )} */}

        {viewMode === "code" && selectedProject && (
          <div className="h-[calc(100vh-140px)]">
            <EnhancedCodeViewer project={selectedProject} />
          </div>
        )}

        {!selectedProject && viewMode == "terminal" && (
          <div className="max-w-4xl mx-auto">{renderTerminal()}</div>
        )}
      </div>
    </div>
  );
}
