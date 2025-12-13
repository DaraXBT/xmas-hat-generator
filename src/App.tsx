import React, {useState, useRef} from "react";
import {Upload, Download, Copy, Check} from "lucide-react";
import Editor, {EditorHandle} from "./components/Editor";
import HatSelector from "./components/HatSelector";
import {Hat} from "./types";

const App: React.FC = () => {
  const [hatToAdd, setHatToAdd] = useState<Hat | null>(null);
  const [hasImage, setHasImage] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const editorRef = useRef<EditorHandle>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && editorRef.current) {
      editorRef.current.loadFile(e.target.files[0]);
    }
  };

  const handleCopy = async () => {
    if (editorRef.current) {
      const success = await editorRef.current.copy();
      if (success) {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-white relative font-sans antialiased">
      {/* Subtle Dotted Background */}
      <div
        className="absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.08) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header Section */}
        <header className="border-b border-black/5 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                  តស់បង្កើតមួកណូអែល
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  បង្កើតរូបភាពពិសេសរបស់អ្នកសម្រាប់ថ្ងៃបុណ្យណូអែល
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Grid Layout */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left: Editor (Takes 2 columns on large screens) */}
            <div className="lg:col-span-2">
              <Editor
                ref={editorRef}
                hatToAdd={hatToAdd}
                onHatAdded={() => setHatToAdd(null)}
                onImageStateChange={setHasImage}
              />
            </div>

            {/* Right: Controls Sidebar */}
            <div className="space-y-6">
              {/* Hat Selector Card */}
              <div className="bg-white rounded-2xl border border-black/10 p-5 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  ជ្រើសរើសម៉ូត
                </h2>
                <HatSelector
                  onSelect={setHatToAdd}
                  selectedHatId={hatToAdd?.id}
                />
              </div>

              {/* Actions Card */}
              <div className="bg-white rounded-2xl border border-black/10 p-5 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                  សកម្មភាព
                </h3>

                <div className="space-y-3">
                  {/* Upload Button */}
                  <label
                    className={`group relative w-full py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all cursor-pointer overflow-hidden ${
                      hasImage
                        ? "bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                    }`}>
                    <Upload className="w-4 h-4" />
                    <span>{hasImage ? "ប្តូររូបភាព" : "Upload រូបភាព"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Copy Button */}
                    <button
                      onClick={handleCopy}
                      disabled={!hasImage}
                      className={`py-3.5 px-4 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                        isCopied
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-white hover:bg-gray-50 text-gray-900 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed border border-gray-200 hover:border-gray-300"
                      }`}>
                      {isCopied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      <span className="hidden sm:inline">
                        {isCopied ? "ចម្លង" : "ចម្លង"}
                      </span>
                    </button>

                    {/* Download Button */}
                    <button
                      onClick={() => editorRef.current?.download()}
                      disabled={!hasImage}
                      className="py-3.5 px-4 bg-gray-900 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all">
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">រក្សាទុក</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-black/5 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                © 2025 KH Christmas Hat Generator
              </p>
              <a
                href="https://x.com/wolfyxbt"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors group">
                <span>Credit to</span>
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 fill-current group-hover:scale-110 transition-transform"
                  aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="font-semibold">@wolfyxbt</span>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
