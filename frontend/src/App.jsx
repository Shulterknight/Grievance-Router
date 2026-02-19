import { useState } from 'react';
import { AlertTriangle, ExternalLink, FileText, Loader2, Send, CheckCircle2 } from 'lucide-react';

function App() {
    const [description, setDescription] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    const analyzeGrievance = async () => {
        setLoading(true);
        setError(null);
        setResult(null);
        setCopied(false);

        try {
            const response = await fetch('http://localhost:5000/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || errorData.details || 'Failed to analyze grievance');
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6 md:p-12 font-sans text-slate-800">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="text-center space-y-2 mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 tracking-tight">
                        Grievance Router
                    </h1>
                    <p className="text-lg text-slate-500 font-medium">AI-Powered Consumer Complaint Assistant</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* LEFT PANEL: Step 1 - Input */}
                    <div className="bg-white/90 backdrop-blur-sm border border-slate-200 shadow-xl rounded-2xl p-6 md:p-8 flex flex-col h-full">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                            Describe Problem
                        </h2>

                        <div className="flex-grow space-y-4">
                            <label className="block text-sm font-semibold text-slate-600">
                                What went wrong?
                            </label>
                            <textarea
                                className="w-full h-64 p-4 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none shadow-inner text-slate-700 text-lg leading-relaxed placeholder:text-slate-400"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe your issue in detail (e.g., 'I ordered a laptop on Amazon last week, but the package arrived empty...')"
                            />
                        </div>

                        <div className="mt-8">
                            <button
                                onClick={analyzeGrievance}
                                disabled={loading || !description.trim()}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        Analyze Grievance <Send className="w-5 h-5" />
                                    </>
                                )}
                            </button>

                            {error && (
                                <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <span className="font-medium">{error}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT PANEL: Step 5 - Dynamic Results */}
                    {result ? (
                        <div className="bg-white/90 backdrop-blur-sm border border-slate-200 shadow-xl rounded-2xl p-6 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                                <span className="bg-green-100 text-green-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                                Analysis Result
                            </h2>

                            {/* Card 1: Urgency */}
                            <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white rounded-full text-red-600 shadow-sm border border-red-100">
                                        <AlertTriangle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-wider font-bold text-red-800 opacity-70">Urgency Level</p>
                                        <h3 className="text-2xl font-bold text-red-900">{result.urgencyLevel}</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Suggested Portals */}
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm">
                                <h3 className="text-sm font-semibold text-blue-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <ExternalLink className="w-4 h-4" /> Suggested Portals
                                </h3>
                                <div className="space-y-3">
                                    {result.suggestedPortals.map((portal, index) => (
                                        <a
                                            key={index}
                                            href={portal.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block group bg-white p-4 rounded-xl border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-blue-700 group-hover:text-blue-800 text-lg">
                                                    {portal.name}
                                                </span>
                                                <ExternalLink className="w-4 h-4 text-blue-400 group-hover:text-blue-600 transition-colors" />
                                            </div>
                                            <p className="text-sm text-slate-600 mt-1 line-clamp-1">{portal.reason}</p>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Card 3: Documents & Draft */}
                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 shadow-sm space-y-6">
                                {/* Checklist */}
                                <div>
                                    <h3 className="text-sm font-semibold text-yellow-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <FileText className="w-4 h-4" /> Required Documents
                                    </h3>
                                    <ul className="space-y-2">
                                        {result.documentsAndDraft.checklist.map((doc, index) => (
                                            <li key={index} className="flex items-start gap-3 text-yellow-900 bg-white/50 p-2 rounded-lg">
                                                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                <span className="text-sm font-medium">{doc}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Privacy Draft Box */}
                                <div className="relative">
                                    <div className="flex justify-between items-end mb-2">
                                        <h3 className="text-sm font-semibold text-yellow-900 uppercase tracking-wider">Complaint Draft</h3>
                                        <button
                                            onClick={() => copyToClipboard(result.documentsAndDraft.draftText)}
                                            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${copied
                                                ? 'bg-green-100 text-green-700 border border-green-200'
                                                : 'bg-white text-yellow-800 border border-yellow-200 hover:bg-yellow-100'
                                                }`}
                                        >
                                            {copied ? (
                                                <>
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Copied!
                                                </>
                                            ) : (
                                                "Copy Draft"
                                            )}
                                        </button>
                                    </div>
                                    <div className="bg-white/80 p-5 rounded-xl border border-yellow-200 text-slate-700 font-mono text-sm leading-relaxed whitespace-pre-wrap shadow-inner h-64 overflow-y-auto">
                                        {result.documentsAndDraft.draftText}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Empty State for Right Panel */
                        <div className="hidden lg:flex bg-white/50 backdrop-blur-sm border border-slate-200/50 rounded-2xl items-center justify-center text-slate-400 p-8 h-full border-dashed border-2">
                            <div className="text-center space-y-4 opacity-50">
                                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                                    <Loader2 className="w-10 h-10 animate-pulse" />
                                </div>
                                <p className="text-lg font-medium">Results will appear here...</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
