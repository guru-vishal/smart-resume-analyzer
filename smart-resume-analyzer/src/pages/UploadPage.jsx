import { useState, useRef, useEffect } from "react";
import { Upload, AlertCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/useAuth";
import axios from "axios"; // Use centralized Axios instance
import { toast } from "react-toastify";

function UploadPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // null, 'uploading', 'success', 'error'
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  // Handle authentication check with useEffect
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to upload a resume.");
      navigate("/login");
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file) => {
    // Check file type
    const fileType = file.type;
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!validTypes.includes(fileType)) {
      setErrorMessage("Please upload a PDF or DOCX file only.");
      setFile(null);
      return;
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("File size exceeds 5MB limit.");
      setFile(null);
      return;
    }

    setErrorMessage("");
    setFile(file);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    setUploadStatus("uploading");
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 200);

    const formData = new FormData();
    formData.append("resume", file);

    const token = localStorage.getItem("token");

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const response = await axios.post("/api/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-auth-token": token
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      // Update localStorage if API returns user data
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus("success");
      toast.success("Resume uploaded successfully!");

      // Redirect to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      clearInterval(progressInterval);
      setUploadStatus("error");
      const errorMsg =
        error.response?.data?.message || "Failed to upload resume. Please try again.";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-700">
      {/* Header */}
      <div className="bg-white shadow dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Upload Resume</h1>
          <p className="mt-1 text-sm text-gray-500">
            Upload your resume to get personalized analytics and improve your score.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden dark:bg-gray-900">
          {/* File Upload Area */}
          <div
            className={`p-6 flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-colors ${
              dragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-300 dark:border-gray-600 hover:border-indigo-400"
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
            />

            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4 flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500"
                  onClick={openFileDialog}
                >
                  <span>Upload a file</span>
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PDF or DOCX up to 5MB</p>
            </div>

            {file && (
              <div className="mt-4 w-full">
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center">
                    <div className="ml-3 flex-1 truncate">
                      <span className="font-medium text-gray-900">{file.name}</span>
                      <span className="text-gray-500 ml-2">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mt-4 flex items-center text-red-500" aria-live="polite">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {uploadStatus === "uploading" && (
            <div className="px-6 py-4 border-t border-gray-200" aria-live="polite">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-400">Uploading...</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-400">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {uploadStatus === "success" && (
            <div className="px-6 py-4 border-t border-gray-200 bg-green-50" aria-live="polite">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-green-700">
                  Resume uploaded successfully! Redirecting to dashboard...
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-label="Cancel upload"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpload}
              disabled={!file || uploadStatus === "uploading"}
              className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                !file || uploadStatus === "uploading"
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              }`}
              aria-label="Upload resume"
            >
              Upload Resume
            </button>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-white shadow rounded-lg overflow-hidden dark:bg-gray-900">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Resume Tips</h2>
          </div>
          <div className="px-6 py-4">
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500">
                  1
                </span>
                <span className="ml-2">Use action verbs to describe your achievements.</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500">
                  2
                </span>
                <span className="ml-2">Quantify your accomplishments with numbers when possible.</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500">
                  3
                </span>
                <span className="ml-2">Tailor your resume to the specific job you're applying for.</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500">
                  4
                </span>
                <span className="ml-2">Keep your resume concise and limit it to 1-2 pages.</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500">
                  5
                </span>
                <span className="ml-2">Proofread carefully to eliminate spelling and grammar errors.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadPage;