'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, Building2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { StoreBreadcrumb } from '@/shared/components/store/store-breadcrumb';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }

    try {
      setSubmitting(true);
      // Giả lập gửi thông tin liên hệ thành công
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success('Gửi lời nhắn thành công! Chúng tôi sẽ phản hồi sớm nhất.');
      setSent(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ffffff] dark:bg-zinc-950 relative overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-[400px] left-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/[0.03] dark:bg-emerald-500/[0.06] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[200px] right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/[0.03] dark:bg-indigo-500/[0.06] blur-[150px] pointer-events-none" />

      {/* Cinematic Banner */}
      <div className="relative py-16 bg-stone-950 overflow-hidden border-b border-stone-900">
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1423662055905-ec3d1268b581?q=80&w=2070&auto=format&fit=crop"
            alt="Contact Banner Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-[#042F2E]/90 to-transparent" />
        </div>
        <div className="absolute top-1/2 left-1/4 w-80 h-80 rounded-full bg-emerald-500/10 blur-[90px] -translate-y-1/2" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-4">
            <Mail size={11} className="shrink-0" /> Liên kết thông tin
          </div>
          <h1 className="font-heading text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
            LIÊN HỆ CHÚNG TÔI
          </h1>
          <p className="text-stone-300 text-xs md:text-sm font-sans max-w-md mt-3 leading-relaxed font-light">
            Chúng tôi luôn sẵn sàng hỗ trợ giải đáp kỹ thuật, tư vấn báo giá thiết bị và các giải pháp tự động hóa.
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-[#F9F9FB] dark:bg-zinc-900 border-b border-stone-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StoreBreadcrumb
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Liên hệ' }
            ]}
            backLink="/"
            backLabel="Quay lại trang chủ"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 select-none">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Info Panels (Left side) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#F9F9FB] dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-8 rounded-3xl space-y-6 shadow-sm border-l-4 border-l-[#0D9488]">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-stone-200/50 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400 text-[9px] font-bold uppercase tracking-wider">
                <Building2 size={10} /> Trụ sở chính
              </div>
              <h3 className="text-lg font-heading font-black text-stone-900 dark:text-white uppercase tracking-wide">
                SENSORX VIỆT NAM
              </h3>
              
              <div className="space-y-4 pt-4 border-t border-stone-200 dark:border-zinc-800">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-white dark:bg-zinc-950 border border-stone-250 dark:border-zinc-800 flex items-center justify-center text-[#0D9488] shrink-0 shadow-sm">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-400">Địa chỉ</h5>
                    <p className="text-xs font-semibold text-stone-850 dark:text-stone-200 mt-1 leading-relaxed">
                      Khu Công nghệ cao Hòa Lạc, Thạch Thất, Hà Nội, Việt Nam
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-white dark:bg-zinc-950 border border-stone-250 dark:border-zinc-800 flex items-center justify-center text-[#0D9488] shrink-0 shadow-sm">
                    <Phone size={16} />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-400">Điện thoại</h5>
                    <p className="text-xs font-semibold text-stone-850 dark:text-stone-200 mt-1">
                      +84 24 3767 8999
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-white dark:bg-zinc-950 border border-stone-250 dark:border-zinc-800 flex items-center justify-center text-[#0D9488] shrink-0 shadow-sm">
                    <Mail size={16} />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-400">Email liên hệ</h5>
                    <p className="text-xs font-semibold text-stone-850 dark:text-stone-200 mt-1 underline decoration-stone-200">
                      support@sensorx.vn
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded maps placeholder or message */}
            <div className="bg-[#F9F9FB] dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-8 rounded-3xl shadow-sm text-center">
              <HelpCircle className="w-10 h-10 text-stone-300 mx-auto mb-3" />
              <h5 className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-400">Thời gian làm việc</h5>
              <p className="text-xs font-bold text-stone-850 dark:text-white mt-1">Thứ 2 - Thứ 6: 08:00 - 17:30</p>
              <p className="text-[10px] text-stone-400 mt-1">Hỗ trợ kỹ thuật 24/7 qua email</p>
            </div>
          </div>

          {/* Contact Form (Right side) */}
          <div className="lg:col-span-7 bg-[#F9F9FB] dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-8 rounded-3xl shadow-sm relative overflow-hidden">
            {sent ? (
              <div className="py-16 text-center space-y-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
                <h3 className="text-lg font-heading font-black text-stone-900 dark:text-white uppercase tracking-wider">
                  Cảm ơn phản hồi của bạn!
                </h3>
                <p className="text-xs text-stone-400 max-w-sm mx-auto leading-relaxed">
                  Lời nhắn của bạn đã được chuyển tới phòng kinh doanh và hỗ trợ kỹ thuật. Chúng tôi sẽ phản hồi lại qua Email của bạn trong vòng 24h.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="px-6 py-2.5 border border-stone-250 text-xs font-bold uppercase tracking-wider rounded-full hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  Gửi lời nhắn mới
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-b border-stone-200 dark:border-zinc-800 pb-4">
                  <h3 className="text-base font-heading font-black text-stone-900 dark:text-white uppercase tracking-wide">
                    Gửi lời nhắn cho SensorX
                  </h3>
                  <p className="text-[10px] text-stone-400 uppercase tracking-wider mt-1">
                    Chúng tôi sẽ liên lạc lại ngay sau khi nhận được thông tin.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-sans font-bold uppercase tracking-widest text-stone-400">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      className="w-full px-4 h-11 bg-white dark:bg-zinc-950 border border-stone-250 dark:border-zinc-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0D9488] transition-all shadow-inner"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-sans font-bold uppercase tracking-widest text-stone-400">
                      Email cá nhân / Doanh nghiệp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="email@company.com"
                      className="w-full px-4 h-11 bg-white dark:bg-zinc-950 border border-stone-250 dark:border-zinc-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0D9488] transition-all shadow-inner"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-sans font-bold uppercase tracking-widest text-stone-400">
                    Chủ đề hỗ trợ (Không bắt buộc)
                  </label>
                  <input
                    type="text"
                    placeholder="Báo giá thiết bị, Tư vấn kỹ thuật..."
                    className="w-full px-4 h-11 bg-white dark:bg-zinc-950 border border-stone-250 dark:border-zinc-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0D9488] transition-all shadow-inner"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-sans font-bold uppercase tracking-widest text-stone-400">
                    Nội dung lời nhắn <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Nhập thông tin chi tiết về yêu cầu hỗ trợ hoặc sản phẩm cần báo giá..."
                    className="w-full p-4 bg-white dark:bg-zinc-950 border border-stone-250 dark:border-zinc-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0D9488] transition-all shadow-inner resize-none leading-relaxed"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center justify-center gap-2.5 px-8 h-12 bg-[#0D9488] hover:bg-[#0F766E] text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer active:scale-95"
                  >
                    {submitting ? 'Đang gửi...' : 'Gửi lời nhắn'}
                    <Send size={13} />
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
