"use client"
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, useSearchParams } from "react-router-dom";
import TaskComponent from "./TaskComponent";

const tasks = [
  {
    id: 1,
    name: "Find and invite reviewers",
    paperTitle: "The Impact of Climate Change on Marine Biodiversity",
    authors: ["Dr. Jane Smith", "Dr. Michael Johnson", "Dr. Emily Davis"],
    tags: ["reviewer selection", "urgent", "assignment"],
    dueDate: "2024-12-15"
  },
  {
    id: 2,
    name: "Initial assessment",
    paperTitle: "Machine Learning Approaches for Genomic Data Analysis",
    authors: ["Dr. Alan Turing", "Dr. Grace Hopper", "Dr. Rosalind Franklin"],
    tags: ["manuscript review", "high priority"],
    dueDate: "2024-12-12"
  },
  {
    id: 3,
    name: "Assess recommendation",
    paperTitle: "Advances in Quantum Computing for Material Science",
    authors: ["Dr. Marie Curie", "Dr. Richard Feynman", "Dr. Albert Einstein"],
    tags: ["decision making", "reject"],
    dueDate: "2024-12-20"
  },
  {
    id: 4,
    name: "Assess recommendation",
    paperTitle: "The Role of Gut Microbiota in Metabolic Diseases",
    authors: ["Dr. Elizabeth Blackwell", "Dr. Jonas Salk", "Dr. Paul Ehrlich"],
    tags: ["decision making", "accept"],
    dueDate: "2024-12-18"
  },
  {
    id: 5,
    name: "Assess recommendation",
    paperTitle: "Renewable Energy Storage Technologies for the Future",
    authors: ["Dr. Nikola Tesla", "Dr. James Maxwell"],
    tags: ["decision making", "reject"],
    dueDate: "2024-12-21"
  },
  {
    id: 6,
    name: "Assess recommendation",
    paperTitle: "Artificial Intelligence in Personalized Medicine",
    authors: ["Dr. Claude Shannon", "Dr. Barbara McClintock"],
    tags: ["decision making", "accept"],
    dueDate: "2024-12-22"
  },
  {
    id: 7,
    name: "Communicate decision to authors",
    paperTitle: "Novel Techniques for Early Cancer Detection",
    authors: ["Dr. Ada Lovelace", "Dr. Charles Darwin"],
    tags: ["communication", "authors"],
    dueDate: "2024-12-22"
  }
];

const App: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from the URL on mount
  useEffect(() => {
    const tagsFromUrl = searchParams.get("tags");
    if (tagsFromUrl) {
      setSelectedTags(tagsFromUrl.split(","));
    }
  }, [searchParams]);

  // Update the URL whenever selectedTags changes
  useEffect(() => {
    if (selectedTags.length > 0) {
      setSearchParams({ tags: selectedTags.join(",") });
    } else {
      setSearchParams({});
    }
  }, [selectedTags, setSearchParams]);

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags((prevTags) =>
        prevTags.includes(tag)
            ? prevTags.filter((t) => t !== tag) // Remove tag
            : [...prevTags, tag] // Add tag
    );
  };

  // Filter tasks based on the selected tags
  const filteredTasks = selectedTags.length
      ? tasks.filter((task) =>
          task.tags.some((tag) => selectedTags.includes(tag))
      )
      : tasks;

  return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
        {/* Selected Tags */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {selectedTags.map((tag) => (
              <span
                  key={tag}
                  className="flex items-center bg-blue-100 text-blue-600 text-xs font-medium px-3 py-1 rounded-full cursor-pointer hover:bg-blue-200"
                  onClick={() => toggleTag(tag)}
              >
            {tag}
                <span className="ml-2 text-gray-500 hover:text-red-600">×</span>
          </span>
          ))}
        </div>

        {/* Task List */}
        <div className="w-full max-w-2xl space-y-4">
          {filteredTasks.map((task) => (
              <TaskComponent
                  key={task.id}
                  task={task}
                  onTagClick={toggleTag}
              />
          ))}
        </div>
      </div>
  );
};

// Wrap the app with the Router
const RootApp: React.FC = () => (
    <Router>
      <App />
    </Router>
);

export default RootApp;
