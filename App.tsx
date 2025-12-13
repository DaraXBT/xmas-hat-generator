import React, {useState, useRef, useEffect} from "react";
import {Upload, Download, Copy, Check, Volume2, VolumeX} from "lucide-react";
import Editor, {EditorHandle} from "./components/Editor";
import HatSelector from "./components/HatSelector";
import {Hat} from "./types";

const App: React.FC = () => {
  const [hatToAdd, setHatToAdd] = useState<Hat | null>(null);
  const [hasImage, setHasImage] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const editorRef = useRef<EditorHandle>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Handle audio play/pause state
  useEffect(() => {
    console.log("🎅 Component mounted, checking audio element...");

    const audio = audioRef.current;
    if (!audio) {
      console.error("❌ Audio element not found! Ref is null.");
      return;
    }

    console.log("✅ Audio element found:", audio);

    const handlePlay = () => {
      setIsPlaying(true);
      console.log("✅ Music is playing!");
    };

    const handlePause = () => {
      setIsPlaying(false);
      console.log("⏸️ Music paused");
    };

    const handleError = (e: Event) => {
      console.error("❌ Audio error:", e);
    };

    const handleCanPlay = () => {
      console.log("🎵 Audio can play - ready to start");
    };

    const handleLoadedData = () => {
      console.log("📦 Audio data loaded");
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("error", handleError);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("loadeddata", handleLoadedData);

    // Multiple attempts to play
    const ensurePlay = async () => {
      console.log("🎄 Attempting to play Christmas music...");
      console.log("📊 Audio state:", {
        paused: audio.paused,
        currentTime: audio.currentTime,
        duration: audio.duration,
        readyState: audio.readyState,
        src: audio.src,
      });

      // Attempt 1: Immediate play
      try {
        audio.volume = 0.5; // Set volume to 50%
        console.log("🔊 Volume set to 50%");
        await audio.play();
        console.log("✅ Autoplay succeeded!");
        return;
      } catch (error) {
        console.log("⚠️ Autoplay blocked. Error:", error);
        console.log("Setting up user interaction trigger...");
      }

      // Attempt 2: On any user interaction
      const playOnInteraction = async (eventType: string) => {
        try {
          console.log(`🎯 User ${eventType} detected - playing music...`);
          await audio.play();
          console.log("✅ Music started after user interaction!");

          // Remove all listeners once playing
          document.removeEventListener("click", clickHandler);
          document.removeEventListener("keydown", keyHandler);
          document.removeEventListener("touchstart", touchHandler);
          document.removeEventListener("scroll", scrollHandler);
        } catch (e) {
          console.error("❌ Failed to play:", e);
        }
      };

      const clickHandler = () => playOnInteraction("click");
      const keyHandler = () => playOnInteraction("keypress");
      const touchHandler = () => playOnInteraction("touch");
      const scrollHandler = () => playOnInteraction("scroll");

      document.addEventListener("click", clickHandler, {once: true});
      document.addEventListener("keydown", keyHandler, {once: true});
      document.addEventListener("touchstart", touchHandler, {once: true});
      document.addEventListener("scroll", scrollHandler, {once: true});

      console.log("👆 Click, tap, or scroll anywhere to start the music!");
    };

    // Small delay to ensure DOM is ready
    setTimeout(ensurePlay, 500);

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
          console.log("⏸️ Music paused");
        } else {
          await audioRef.current.play();
          setIsPlaying(true);
          console.log("▶️ Music playing");
        }
      } catch (error) {
        console.error("Toggle error:", error);
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
    <div className="min-h-screen bg-[#f5f5f7] font-sans">
      {/* Hidden Audio Element with autoplay */}
      <audio
        ref={audioRef}
        autoPlay
        loop
        preload="auto"
        muted={false}
        playsInline
        className="hidden">
        <source src="/christmas-song.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Music Toggle Button - Fixed position */}
      <button
        onClick={toggleMusic}
        className={`fixed top-6 right-6 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all ${
          isPlaying
            ? "bg-[#0071e3] hover:bg-[#0077ed] border-2 border-[#0071e3]"
            : "bg-white hover:bg-[#fafafa] border border-[#d2d2d7] hover:border-[#86868b] animate-pulse"
        }`}
        title={
          isPlaying ? "Pause Christmas music 🎵" : "Play Christmas music 🎄"
        }>
        {isPlaying ? (
          <Volume2 className="w-5 h-5 text-white" />
        ) : (
          <VolumeX className="w-5 h-5 text-[#ff3b30]" />
        )}
      </button>

      <div className="max-w-[980px] mx-auto px-6 py-12 md:py-20">
        <main className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          {/* Left Column: Editor - Occupies more space */}
          <div className="md:col-span-8 space-y-8">
            <Editor
              ref={editorRef}
              hatToAdd={hatToAdd}
              onHatAdded={() => setHatToAdd(null)}
              onImageStateChange={setHasImage}
            />
          </div>

          {/* Right Column: Title & Tools - Sticky on desktop */}
          <div className="md:col-span-4 space-y-10 md:sticky md:top-24">
            {/* 1. Header Content */}
            <div>
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#1d1d1f] mb-4">
                តស់បង្កើតមួកណូអែល
              </h1>
              <p className="text-lg md:text-xl leading-relaxed font-medium text-[#1d1d1f]">
                ផ្ទុកឡើងរូបភាព ហើយសាកល្បងភ្លាមៗ។
                <br />
                <span className="text-[#86868b]">
                  បង្កើតរូបភាពពិសេសរបស់អ្នកសម្រាប់ពិធីបុណ្យ។
                </span>
              </p>
            </div>

            {/* 2. Style Selector */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight mb-4">
                  ជ្រើសរើសម៉ូត
                </h2>
                <HatSelector
                  onSelect={setHatToAdd}
                  selectedHatId={hatToAdd?.id}
                />
              </div>
            </div>

            {/* 3. Actions Module */}
            <div className="pt-6 border-t border-[#d2d2d7]">
              <div className="flex flex-col gap-3">
                <label
                  className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-medium transition-all cursor-pointer ${
                    hasImage
                      ? "bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f]"
                      : "bg-[#e5e5e5] text-[#86868b] cursor-not-allowed"
                  }`}>
                  <Upload className="w-5 h-5" />
                  <span>
                    {hasImage
                      ? "ប្តូររូបភាពមូលដ្ឋាន"
                      : "ផ្ទុកឡើងរូបភាពមូលដ្ឋាន"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleCopy}
                    disabled={!hasImage}
                    className={`w-full py-4 rounded-2xl font-medium flex items-center justify-center gap-2 transition-all shadow-sm ${
                      isCopied
                        ? "bg-[#e5fcf5] text-[#00a368]"
                        : "bg-white hover:bg-[#fafafa] text-[#1d1d1f] disabled:bg-[#f5f5f7] disabled:text-[#86868b] disabled:cursor-not-allowed border border-[#d2d2d7] hover:border-[#86868b]"
                    }`}>
                    {isCopied ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                    {isCopied ? "បានចម្លងរួច" : "ចម្លងរូបភាព"}
                  </button>

                  <button
                    onClick={() => editorRef.current?.download()}
                    disabled={!hasImage}
                    className="w-full py-4 bg-[#0071e3] hover:bg-[#0077ed] disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-2xl font-medium flex items-center justify-center gap-2 transition-all shadow-sm">
                    <Download className="w-5 h-5" />
                    រក្សាទុករូបភាព
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
