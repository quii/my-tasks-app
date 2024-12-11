"use client"
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, useSearchParams } from "react-router-dom";

// Task interface
interface Task {
    id: number;
    name: string;
    paperTitle: string;
    authors: string[];
    tags: string[];
    dueDate: string;
}

// Initial tasks data
const initialTasks: Task[] = [
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

const TaskComponent: React.FC<{
    task: Task;
    onTagClick: (tag: string) => void;
    onAddTag: (id: number, tag: string) => void;
    onRemoveTag: (id: number, tag: string) => void;
}> = ({ task, onTagClick, onAddTag, onRemoveTag }) => {
    const [newTag, setNewTag] = useState("");

    const handleAddTag = () => {
        if (newTag.trim() !== "") {
            onAddTag(task.id, newTag.trim());
            setNewTag("");
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-4 space-y-2">
            <h3 className="text-lg font-semibold">{task.paperTitle}</h3>
            <p className="text-sm text-gray-500">By: {task.authors.join(", ")}</p>
            <div className="text-gray-700 text-sm">{task.name}</div>
            <div className="flex flex-wrap gap-2 mt-2">
                {task.tags.map((tag) => (
                    <span
                        key={tag}
                        className="flex items-center bg-blue-100 text-blue-600 text-xs font-medium px-3 py-1 rounded-full cursor-pointer"
                        onClick={() => onTagClick(tag)}
                    >
            {tag}
                        <span
                            className="ml-2 text-gray-500 hover:text-red-600"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent the tag click event
                                onRemoveTag(task.id, tag); // Trigger remove tag
                            }}
                        >
              ×
            </span>
          </span>
                ))}
            </div>
            <div className="mt-2 flex items-center">
                <input
                    type="text"
                    placeholder="Add a tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="border border-gray-300 rounded-l px-2 py-1 text-sm w-full"
                />
                <button
                    onClick={handleAddTag}
                    className="bg-blue-500 text-white text-sm px-3 py-1 rounded-r hover:bg-blue-600"
                >
                    Add
                </button>
            </div>
        </div>
    );
};

const App: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [bookmarks, setBookmarks] = useState<{ name: string; tags: string[] }[]>(
        []
    );
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

    // Add a tag to a task
    const addTagToTask = (id: number, tag: string) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === id ? { ...task, tags: [...task.tags, tag] } : task
            )
        );
    };

    // Remove a tag from a task
    const removeTagFromTask = (id: number, tag: string) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === id
                    ? { ...task, tags: task.tags.filter((t) => t !== tag) }
                    : task
            )
        );
    };

    // Save a bookmark
    const saveBookmark = () => {
        const name = prompt("Enter a name for this bookmark:");
        if (name) {
            setBookmarks([...bookmarks, { name, tags: selectedTags }]);
        }
    };

    // Apply a bookmark
    const applyBookmark = (tags: string[]) => {
        setSelectedTags(tags);
    };

    // Filter tasks based on the selected tags (Logical AND)
    const filteredTasks = selectedTags.length
        ? tasks.filter((task) =>
            selectedTags.every((tag) => task.tags.includes(tag)) // Logical AND: task must have all selected tags
        )
        : tasks;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
            {/* Active Filters (Selected Tags) */}
            {selectedTags.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                    <p className="font-semibold text-gray-800">Active Filters:</p>
                    {selectedTags.map((tag, index) => (
                        <span
                            key={index}
                            className="flex items-center bg-blue-100 text-blue-600 text-xs font-medium px-3 py-1 rounded-full cursor-pointer"
                        >
              {tag}
                            <span
                                className="ml-2 text-gray-500 hover:text-red-600"
                                onClick={() => {
                                    setSelectedTags(selectedTags.filter((t) => t !== tag));
                                }}
                            >
                ×
              </span>
            </span>
                    ))}
                </div>
            )}

            {/* Bookmark button */}
            {selectedTags.length > 0 && (
                <button
                    onClick={saveBookmark}
                    className="bg-green-500 text-white px-4 py-2 rounded-md mb-4"
                >
                    Save Bookmark
                </button>
            )}

            {/* Bookmarks */}
            <div className="mb-4">
                <h3 className="font-semibold text-lg">Bookmarks:</h3>
                <ul>
                    {bookmarks.map((bookmark, index) => (
                        <li key={index} className="flex items-center gap-2">
                            <button
                                onClick={() => applyBookmark(bookmark.tags)}
                                className="text-blue-600 text-sm hover:underline"
                            >
                                {bookmark.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Task List */}
            <div className="w-full max-w-4xl space-y-4">
                {filteredTasks.map((task) => (
                    <TaskComponent
                        key={task.id}
                        task={task}
                        onTagClick={toggleTag}
                        onAddTag={addTagToTask}
                        onRemoveTag={removeTagFromTask}
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
