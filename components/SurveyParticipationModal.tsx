import React, { useState } from 'react';
import {
  X,
  ClipboardCheck,
  CheckCircle2,
  Sparkles,
  MapPin,
  Users,
  AlertTriangle,
  Recycle,
  HeartHandshake,
  MessageSquare,
  HelpCircle,
  Send,
  User
} from 'lucide-react';
import { SURVEY_FORM_DATA } from '../data/environmentalData';

export interface SurveyAnswerSubmission {
  userName?: string;
  ageGroup: string;
  occupation: string;
  district: string;
  pollutionSeverity: string;
  wasteSorting: string;
  volunteerWillingness: string;
  cleaningParticipation?: string;
  feedback?: string;
}

interface SurveyParticipationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SurveyAnswerSubmission) => void;
  currentTotal: number;
}

export const SurveyParticipationModal: React.FC<SurveyParticipationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentTotal
}) => {
  const [userName, setUserName] = useState('');
  const [ageGroup, setAgeGroup] = useState(SURVEY_FORM_DATA.ageGroups[0].label);
  const [occupation, setOccupation] = useState(SURVEY_FORM_DATA.occupations[0].label);
  const [district, setDistrict] = useState(SURVEY_FORM_DATA.districts[0].name);
  const [pollutionSeverity, setPollutionSeverity] = useState(SURVEY_FORM_DATA.pollutionSeverity[0].label);
  const [wasteSorting, setWasteSorting] = useState(SURVEY_FORM_DATA.wasteSorting[0].label);
  const [volunteerWillingness, setVolunteerWillingness] = useState(SURVEY_FORM_DATA.volunteerWillingness[0].label);
  const [cleaningParticipation, setCleaningParticipation] = useState(SURVEY_FORM_DATA.cleaningParticipation[0].label);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      onSubmit({
        userName: userName.trim() || 'Người tham gia ẩn danh',
        ageGroup,
        occupation,
        district,
        pollutionSeverity,
        wasteSorting,
        volunteerWillingness,
        cleaningParticipation,
        feedback: feedback.trim()
      });
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1400);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-950/80 via-zinc-900 to-teal-950/80 p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Phiếu Khảo Sát Ý Kiến Cộng Đồng TP.HCM</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Lượt #{currentTotal + 1}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Các câu trả lời của bạn sẽ <span className="text-emerald-400 font-semibold">lập tức làm thay đổi</span> các tỷ lệ và biểu đồ thống kê bên dưới!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            title="Đóng modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-white">Đã Ghi Nhận Phiếu Khảo Sát Thành Công!</h4>
            <p className="text-sm text-zinc-300 max-w-md">
              Hệ thống đã cập nhật lượt khảo sát thứ <strong className="text-emerald-400">#{currentTotal + 1}</strong>. Tất cả biểu đồ tỷ lệ % đang tự động điều chỉnh theo ý kiến của bạn!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Optional name */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>Họ tên hoặc Biệt danh của bạn (Tùy chọn)</span>
              </label>
              <input
                type="text"
                placeholder="VD: Nguyễn Văn A - Sinh viên ĐH Bách Khoa (để trống nếu ẩn danh)"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Q1: Age Group */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-teal-400" />
                <span>1. Nhóm tuổi của bạn:</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SURVEY_FORM_DATA.ageGroups.map((group) => (
                  <label
                    key={group.label}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      ageGroup === group.label
                        ? 'bg-emerald-950/60 border-emerald-500 text-white font-medium shadow-sm'
                        : 'bg-zinc-950/50 border-zinc-800 text-zinc-300 hover:bg-zinc-800/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="ageGroup"
                      value={group.label}
                      checked={ageGroup === group.label}
                      onChange={() => setAgeGroup(group.label)}
                      className="accent-emerald-500 w-4 h-4"
                    />
                    <span>{group.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Q2: Occupation */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>2. Nghề nghiệp hiện tại:</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {SURVEY_FORM_DATA.occupations.map((occ) => (
                  <label
                    key={occ.label}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      occupation === occ.label
                        ? 'bg-cyan-950/60 border-cyan-500 text-white font-medium shadow-sm'
                        : 'bg-zinc-950/50 border-zinc-800 text-zinc-300 hover:bg-zinc-800/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="occupation"
                      value={occ.label}
                      checked={occupation === occ.label}
                      onChange={() => setOccupation(occ.label)}
                      className="accent-cyan-500 w-4 h-4"
                    />
                    <span>{occ.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Q3: District */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>3. Khu vực bạn đang sinh sống tại TP.HCM:</span>
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                {SURVEY_FORM_DATA.districts.map((d) => (
                  <option key={d.name} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Q4: Pollution Severity */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>4. Bạn đánh giá mức độ ô nhiễm rác nhựa tại nơi bạn ở như thế nào?</span>
              </label>
              <div className="space-y-1.5">
                {SURVEY_FORM_DATA.pollutionSeverity.map((item) => (
                  <label
                    key={item.label}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      pollutionSeverity === item.label
                        ? 'bg-amber-950/50 border-amber-500 text-white font-medium'
                        : 'bg-zinc-950/50 border-zinc-800 text-zinc-300 hover:bg-zinc-800/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pollutionSeverity"
                      value={item.label}
                      checked={pollutionSeverity === item.label}
                      onChange={() => setPollutionSeverity(item.label)}
                      className="accent-amber-500 w-4 h-4"
                    />
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Q5: Waste Sorting */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <Recycle className="w-3.5 h-3.5 text-emerald-400" />
                <span>5. Thực trạng phân loại rác tại nguồn ở gia đình/khu bạn sống?</span>
              </label>
              <div className="space-y-1.5">
                {SURVEY_FORM_DATA.wasteSorting.map((item) => (
                  <label
                    key={item.label}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      wasteSorting === item.label
                        ? 'bg-emerald-950/50 border-emerald-500 text-white font-medium'
                        : 'bg-zinc-950/50 border-zinc-800 text-zinc-300 hover:bg-zinc-800/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="wasteSorting"
                      value={item.label}
                      checked={wasteSorting === item.label}
                      onChange={() => setWasteSorting(item.label)}
                      className="accent-emerald-500 w-4 h-4 mt-0.5"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span>{item.label}</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-0.5">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Q6: Volunteer Willingness */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-teal-400" />
                <span>6. Bạn có sẵn sàng tham gia dọn rác tình nguyện cuối tuần nếu có tổ chức an toàn?</span>
              </label>
              <div className="space-y-1.5">
                {SURVEY_FORM_DATA.volunteerWillingness.map((item) => (
                  <label
                    key={item.label}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      volunteerWillingness === item.label
                        ? 'bg-teal-950/50 border-teal-500 text-white font-medium'
                        : 'bg-zinc-950/50 border-zinc-800 text-zinc-300 hover:bg-zinc-800/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="volunteerWillingness"
                      value={item.label}
                      checked={volunteerWillingness === item.label}
                      onChange={() => setVolunteerWillingness(item.label)}
                      className="accent-teal-500 w-4 h-4"
                    />
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Optional feedback */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
                <span>Đề xuất hoặc giải pháp của bạn cho kênh rạch TP.HCM (Tùy chọn)</span>
              </label>
              <textarea
                rows={2}
                placeholder="VD: Cần thêm camera xử phạt người xả rác và lắp lưới chặn rác tự động..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Submit button */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Đang cập nhật biểu đồ...' : 'Gửi Ý Kiến & Cập Nhật Biểu Đồ Ngay'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
