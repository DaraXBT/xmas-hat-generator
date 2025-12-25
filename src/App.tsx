import React, {useState, useRef, useEffect} from "react";
import {Upload, Download, Copy, Check, Volume2, VolumeX, Snowflake} from "lucide-react";
import Editor, {EditorHandle} from "./components/Editor";
import HatSelector from "./components/HatSelector";
import SnowEffect from "./components/SnowEffect";
import {Hat} from "./types";

const App: React.FC = () => {
  const [hatToAdd, setHatToAdd] = useState<Hat | null>(null);
  const [hasImage, setHasImage] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSnowing, setIsSnowing] = useState(true);
  const editorRef = useRef<EditorHandle>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Handle audio play/pause state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleError = () => {
      // Audio error occurred
    };

    const handleCanPlay = () => {
      // Audio can play - ready to start
    };

    const handleLoadedData = () => {
      // Audio data loaded
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("error", handleError);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("loadeddata", handleLoadedData);

    // Attempt to start audio with unmuting trick
    const startAudio = async () => {
      try {
        // Start muted to bypass autoplay policy
        audio.muted = true;
        audio.volume = 0.5;
        await audio.play();

        // Small delay then unmute
        setTimeout(() => {
          audio.muted = false;
        }, 100);
      } catch (error) {
        // If still blocked, wait for user interaction
        const playOnInteraction = async () => {
          try {
            audio.muted = false;
            audio.volume = 0.5;
            await audio.play();

            // Remove all listeners once playing
            document.removeEventListener("click", clickHandler);
            document.removeEventListener("keydown", keyHandler);
            document.removeEventListener("touchstart", touchHandler);
          } catch (e) {
            // Failed to play after user interaction
          }
        };

        const clickHandler = () => playOnInteraction();
        const keyHandler = () => playOnInteraction();
        const touchHandler = () => playOnInteraction();

        document.addEventListener("click", clickHandler, {once: true});
        document.addEventListener("keydown", keyHandler, {once: true});
        document.addEventListener("touchstart", touchHandler, {once: true});
      }
    };

    // Small delay to ensure DOM is ready
    setTimeout(startAudio, 100);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("loadeddata", handleLoadedData);
    };
  }, []);

  const toggleMusic = async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          await audioRef.current.play();
          setIsPlaying(true);
        }
      } catch (error) {
        // Toggle error
      }
    }
  };

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
    <div className="min-h-screen w-full bg-white relative text-gray-800">
      {/* Snow Effect */}
      {isSnowing && <SnowEffect />}

      {/* Crosshatch Art - Light Pattern */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(75, 85, 99, 0.06) 2px, rgba(75, 85, 99, 0.06) 3px, transparent 3px, transparent 8px),
            repeating-linear-gradient(67.5deg, transparent, transparent 2px, rgba(107, 114, 128, 0.05) 2px, rgba(107, 114, 128, 0.05) 3px, transparent 3px, transparent 8px),
            repeating-linear-gradient(112.5deg, transparent, transparent 2px, rgba(55, 65, 81, 0.04) 2px, rgba(55, 65, 81, 0.04) 3px, transparent 3px, transparent 8px),
            repeating-linear-gradient(157.5deg, transparent, transparent 2px, rgba(31, 41, 55, 0.03) 2px, rgba(31, 41, 55, 0.03) 3px, transparent 3px, transparent 8px)
          `,
        }}
      />

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        autoPlay
        loop
        preload="auto"
        muted
        playsInline
        className="hidden">
        <source src="/christmas-song.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header Section */}
        <header className="border-b border-black/5 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src="/logo.jpg"
                  alt="Logo"
                  className="w-12 h-12 object-cover rounded-lg shadow-md"
                />
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                    តស់បង្កើតមួកណូអែល
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    បង្កើតរូបភាពពិសេសរបស់អ្នកសម្រាប់ថ្ងៃបុណ្យណូអែល
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Snow Toggle */}
                <button
                  onClick={() => setIsSnowing(!isSnowing)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isSnowing
                      ? "bg-blue-500 hover:bg-blue-600 shadow-lg"
                      : "bg-gray-100 hover:bg-gray-200 border border-gray-200"
                  }`}
                  title={isSnowing ? "❄️ Stop Snowing" : "🌨️ Let it Snow"}>
                    <Snowflake className={`w-4 h-4 ${isSnowing ? "text-white" : "text-gray-600"}`} />
                </button>

                {/* Music Toggle */}
                <button
                  onClick={toggleMusic}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isPlaying
                      ? "bg-red-500 hover:bg-red-600 shadow-lg"
                      : "bg-gray-100 hover:bg-gray-200 border border-gray-200"
                  }`}
                  title={
                    isPlaying ? "🎄 Jingle Bells Playing" : "🔔 Play Jingle Bells"
                  }>
                  {isPlaying ? (
                    <Volume2 className="w-4 h-4 text-white" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-gray-600" />
                  )}
                </button>
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
                        {isCopied ? "ចម្លងរួច" : "ចម្លង"}
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
        <footer className="border-t border-black/5 mt-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-xs text-gray-500">
                © 2025 KH Christmas Hat Generator
              </p>
              <a
                href="https://x.com/drv3v"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 transition-colors group">
                <svg
                  viewBox="0 0 24 24"
                  className="w-3.5 h-3.5 fill-current group-hover:scale-110 transition-transform"
                  aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="font-semibold">@drv3v</span>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
