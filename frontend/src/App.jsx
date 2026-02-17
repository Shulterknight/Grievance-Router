import { useState } from 'react';
import { AlertCircle, ExternalLink, FileText, Loader2, Send } from 'lucide-react';

function App() {
    const [description, setDescription] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const analyzeGrievance = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

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
        alert('Draft copied to clipboard!');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="text-center space-y-2">
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Grievance Router</h1>
                    <p className="text-gray-600">AI-Powered Consumer Complaint Assistant</p>
                </header>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Describe your problem
                    </label>
                    <textarea
                        className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-800"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your issue in detail..."
                    />
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={analyzeGrievance}
                            disabled={loading || !description.trim()}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Analyze Grievance
                                </>
                            )}
                        </button>
                    </div>
                    {error && (
                        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </div>
                    )}
                </div>

                {result && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Card 1: Urgency */}
                        <div className="bg-red-100 border border-red-300 rounded-xl p-6 shadow-sm md:col-span-2">
                            <div className="flex items-center gap-3 mb-2">
                                <AlertCircle className="w-6 h-6 text-red-800" />
                                <h2 className="text-xl font-bold text-red-800">Urgency Level: {result.urgencyLevel}</h2>
                            </div>
                            <p className="text-red-700">Action should be taken immediately based on the severity of your complaint.</p>
                        </div>

                        {/* Card 2: Suggested Portals */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                                <ExternalLink className="w-5 h-5" />
                                Suggested Portals
                            </h2>
                            <ul className="space-y-3">
                                {result.suggestedPortals.map((portal, index) => (
                                    <li key={index} className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                                        <a
                                            href={portal.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-semibold text-blue-700 hover:underline flex items-center gap-1"
                                        >
                                            {portal.name} <ExternalLink className="w-3 h-3" />
                                        </a>
                                        <p className="text-sm text-gray-600 mt-1">{portal.reason}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Card 3: Documents & Draft */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 shadow-sm md:col-span-2">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h2 className="text-lg font-bold text-yellow-900 mb-4 flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        Required Documents
                                    </h2>
                                    <ul className="list-disc list-inside space-y-1 text-yellow-800">
                                        {result.documentsAndDraft.checklist.map((doc, index) => (
                                            <li key={index}>{doc}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <h2 className="text-lg font-bold text-yellow-900">Complaint Draft</h2>
                                        <button
                                            onClick={() => copyToClipboard(result.documentsAndDraft.draftText)}
                                            className="text-xs px-2 py-1 bg-yellow-200 text-yellow-800 rounded hover:bg-yellow-300 transition-colors"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border border-yellow-100 text-sm text-gray-800 whitespace-pre-wrap h-48 overflow-y-auto">
                                        {result.documentsAndDraft.draftText}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
