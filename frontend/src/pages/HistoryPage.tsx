import React, { useState } from 'react';
import {
  History,
  Search,
  Trash2,
  Download,
  Clock,
  FileText,
  Check,
  Copy,
} from 'lucide-react';
import { useAnalysis } from '../context/AnalysisContext';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';
import { useToast } from '../components/common/Toast';
import type { AnalysisRecord } from '../types';

interface HistoryPageProps {
  onNavigateToAnalyzer: () => void;
  onNavigateToImproved: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  onNavigateToAnalyzer,
  onNavigateToImproved,
}) => {
  const { history, loadHistoryRecord, deleteHistoryRecord } = useAnalysis();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTone, setSelectedTone] = useState('All');
  const [selectedRecordForExport, setSelectedRecordForExport] = useState<AnalysisRecord | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [copiedExport, setCopiedExport] = useState(false);
  const { showToast } = useToast();

  const tones = ['All', 'Professional', 'Academic', 'Casual', 'Concise'];

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.originalText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTone = selectedTone === 'All' || item.targetTone === selectedTone;
    return matchesSearch && matchesTone;
  });

  const handleOpenExport = (record: AnalysisRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRecordForExport(record);
    setIsExportModalOpen(true);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteHistoryRecord(id);
      showToast('Record removed from analysis history.', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete record.', 'error');
    }
  };

  const handleLoad = (id: string) => {
    loadHistoryRecord(id);
    showToast('Loaded analysis record into studio.');
    onNavigateToImproved();
  };

  const generateMarkdownReport = (record: AnalysisRecord) => {
    return `# Grammar & Style Improver Analysis Report
**Title:** ${record.title}
**Date:** ${new Date(record.createdAt).toLocaleString()}
**Target Tone:** ${record.targetTone}
**AI Provider:** ${record.providerUsed}

## Readability Metrics
- **Flesch Reading Ease:** ${record.metrics.fleschScore} (${record.metrics.fleschCategory})
- **Equivalent Grade Level:** ${record.metrics.gradeLevel}
- **Word Count:** ${record.metrics.wordCount}
- **Sentence Count:** ${record.metrics.sentenceCount}
- **Average Sentence Length:** ${record.metrics.averageSentenceLength} words
- **Estimated Reading Time:** ~${record.metrics.readingTimeMinutes} min

## Original Text
> ${record.originalText}

## Improved Text
> ${record.improvedText}

## Detected Grammar & Spelling Issues (${record.issues.length})
${record.issues.map((i, idx) => `${idx + 1}. [${i.category}] ${i.message} (Original: "${i.originalText}" -> Suggested: "${i.replacements.join(', ')}")`).join('\n') || 'No issues found.'}
`;
  };

  const handleCopyExportMarkdown = () => {
    if (!selectedRecordForExport) return;
    const md = generateMarkdownReport(selectedRecordForExport);
    navigator.clipboard.writeText(md);
    setCopiedExport(true);
    showToast('Report copied as Markdown!');
    setTimeout(() => setCopiedExport(false), 2000);
  };

  const handleDownloadJSON = () => {
    if (!selectedRecordForExport) return;
    const blob = new Blob([JSON.stringify(selectedRecordForExport, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis-${selectedRecordForExport.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('JSON report downloaded successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-[#071B50] rounded-2xl border border-[rgba(79,130,255,0.25)] shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-[#255DCE] to-[#021861] text-white border border-[rgba(79,130,255,0.4)] shadow-md shadow-[#255DCE]/30">
            <History className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Analysis History & Archive
            </h3>
            <p className="text-xs text-[#7B9AD0] mt-0.5">
              All records for signed-in user <strong className="text-white font-semibold">{user?.email}</strong>
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={onNavigateToAnalyzer}
        >
          + New Analysis
        </Button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-[#071B50] rounded-2xl border border-[rgba(79,130,255,0.25)] shadow-xl">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7B9AD0]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title or text snippet..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#0A245F] border border-[rgba(79,130,255,0.3)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#255DCE]/50 text-white placeholder:text-[#7B9AD0]/60"
          />
        </div>

        {/* Tone Filter */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-[#7B9AD0] shrink-0 mr-1">Tone:</span>
          {tones.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTone(t)}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer shrink-0 ${
                selectedTone === t
                  ? 'bg-gradient-to-r from-[#255DCE] to-[#102F91] text-white shadow-xs border border-[#255DCE]'
                  : 'bg-[#0A245F] text-[#B8C8F5] border border-[rgba(79,130,255,0.2)] hover:bg-[#102F91]/50 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Records List or Empty State */}
      {filteredHistory.length === 0 ? (
        <Card className="p-8 border-[rgba(79,130,255,0.25)] bg-[#071B50]">
          <EmptyState
            icon={<FileText className="w-6 h-6 text-[#255DCE]" />}
            title="No History Records Found"
            description={
              searchTerm || selectedTone !== 'All'
                ? 'No past analyses match your search query or filter.'
                : 'You have not performed any analyses yet. Start by entering text in the Text Analyzer.'
            }
            actionLabel="Start New Analysis"
            onAction={onNavigateToAnalyzer}
          />
        </Card>
      ) : (
        <div className="space-y-3.5">
          {filteredHistory.map((item) => (
            <Card
              key={item.id}
              onClick={() => handleLoad(item.id)}
              hoverEffect={true}
              className="p-5 border-[rgba(79,130,255,0.25)] shadow-xl cursor-pointer group bg-[#071B50] hover:border-[#255DCE]/70 hover:shadow-[#255DCE]/10 transition-all"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-[rgba(79,130,255,0.2)]">
                <div className="flex items-center gap-2.5">
                  <h4 className="text-sm font-bold text-white group-hover:text-[#93b4fd] transition-colors">
                    {item.title}
                  </h4>
                  <Badge variant="blue" size="sm">
                    {item.targetTone}
                  </Badge>
                  <span className="text-2xs font-mono text-[#B8C8F5] bg-[#0A245F] px-2.5 py-0.5 rounded-md border border-[rgba(79,130,255,0.25)]">
                    {item.metrics.wordCount} words
                  </span>
                </div>

                <div className="flex items-center gap-3 text-2xs text-[#7B9AD0]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#255DCE]" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Text Preview Snippet */}
              <p className="text-xs text-[#B8C8F5] line-clamp-2 leading-relaxed mb-4 font-sans">
                "{item.originalText}"
              </p>

              {/* Bottom Metrics Bar & Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex flex-wrap items-center gap-2 text-2xs">
                  <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#102F91] to-[#0A245F] text-white font-bold border border-[#255DCE]/40">
                    Flesch: {item.metrics.fleschScore} ({item.metrics.fleschCategory})
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#0A245F] text-[#B8C8F5] font-semibold border border-[rgba(79,130,255,0.25)]">
                    Grade: {item.metrics.gradeLevel}
                  </span>
                  {item.issues.length > 0 ? (
                    <span className="px-2.5 py-1 rounded-lg bg-[#2a0808]/70 text-[#fca5a5] font-semibold border border-[#DE1110]/40">
                      {item.issues.length} Issues
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-lg bg-[#0A245F] text-[#255DCE] font-semibold border border-[#255DCE]/30">
                      0 Issues Clean
                    </span>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleOpenExport(item, e)}
                    className="p-1.5 rounded-lg text-[#B8C8F5] hover:text-white hover:bg-[#0A245F] transition-colors text-xs flex items-center gap-1 cursor-pointer border border-[rgba(79,130,255,0.2)]"
                    title="Export report"
                  >
                    <Download className="w-3.5 h-3.5 text-[#255DCE]" />
                    <span>Export</span>
                  </button>
                  <button
                    onClick={(e) => handleDelete(item.id, e)}
                    className="p-1.5 rounded-lg text-[#DE1110] hover:text-white hover:bg-[#DE1110] transition-colors cursor-pointer border border-[#DE1110]/30"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-semibold text-[#93b4fd] group-hover:text-white flex items-center gap-1 ml-1 transition-colors">
                    Load Record →
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Export Report Modal */}
      {selectedRecordForExport && (
        <Modal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          title="Export Analysis Report"
          description={`Record: ${selectedRecordForExport.title}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <p className="text-xs text-[#B8C8F5]">
              Download the complete analysis report including mathematical readability metrics,
              syntactic grammar rules, and AI rewrites:
            </p>

            <div className="p-4 bg-[#04123F] rounded-xl border border-[rgba(79,130,255,0.25)] text-2xs font-mono text-[#F5F7FF] max-h-56 overflow-y-auto whitespace-pre-wrap selection:bg-[#255DCE]/40">
              {generateMarkdownReport(selectedRecordForExport)}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyExportMarkdown}
                leftIcon={copiedExport ? <Check className="w-3.5 h-3.5 text-[#255DCE]" /> : <Copy className="w-3.5 h-3.5" />}
              >
                {copiedExport ? 'Copied' : 'Copy as Markdown'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleDownloadJSON}
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                Download JSON Report
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
