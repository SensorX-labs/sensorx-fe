'use client';

import React from 'react';
import {Settings, Building2, Bell, Shield, Cpu, RefreshCw, Save} from 'lucide-react';
import {Card, CardContent, CardHeader, CardTitle} from '@/shared/components/shadcn-ui/card';
import {AISettingService} from '../../services/ai-setting.service';
import {toast} from 'sonner';

const settingGroups = [
    {
        title: 'Thông tin công ty',
        icon: Building2,
        fields: [
            {
                label: 'Tên công ty',
                value: 'Công ty TNHH Axetic',
                type: 'text'
            },
            {
                label: 'Mã số thuế',
                value: '0123456789',
                type: 'text'
            },
            {
                label: 'Địa chỉ',
                value: '123 Nguyễn Huệ, Q.1, TP.HCM',
                type: 'text'
            },
            {
                label: 'Email liên hệ',
                value: 'contact@axetic.vn',
                type: 'email'
            }, {
                label: 'Số điện thoại',
                value: '028 1234 5678',
                type: 'text'
            },
        ]
    }, {
        title: 'Thông báo',
        icon: Bell,
        fields: [
            {
                label: 'Email thông báo đơn hàng mới',
                value: 'Bật',
                type: 'toggle'
            }, {
                label: 'Email thông báo hàng sắp hết',
                value: 'Bật',
                type: 'toggle'
            }, {
                label: 'SMS thông báo đơn hàng',
                value: 'Tắt',
                type: 'toggle'
            }, {
                label: 'Thông báo trình duyệt',
                value: 'Bật',
                type: 'toggle'
            },
        ]
    }, {
        title: 'Bảo mật',
        icon: Shield,
        fields: [
            {
                label: 'Xác thực 2 bước',
                value: 'Đã bật',
                type: 'toggle'
            }, {
                label: 'Thời gian hết phiên (phút)',
                value: '60',
                type: 'text'
            }, {
                label: 'Cho phép đăng nhập từ nhiều thiết bị',
                value: 'Có',
                type: 'toggle'
            },
        ]
    },
];

export default function SettingsPage() {
    const [aiLoading, setAiLoading] = React.useState(true);
    const [updating, setUpdating] = React.useState(false);

    // Form inputs
    const [kInput, setKInput] = React.useState('');
    const [idleWeightInput, setIdleWeightInput] = React.useState('');
    const [lrInput, setLrInput] = React.useState('');

    const fetchAIParams = async () => {
        try {
            const res = await AISettingService.getHyperparameters();
            if (res) {
                setKInput(res.k.toString());
                setIdleWeightInput(res.idleWeight.toString());
                setLrInput(res.learningRate.toString());
            }
        } catch (error) {
            console.error(">>> Lỗi khi lấy cấu hình AI:", error);
            toast.error("Không thể lấy cấu hình thuật toán AI");
        } finally {
            setAiLoading(false);
        }
    };

    React.useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchAIParams();
    }, []);

    const handleUpdateAI = async (e: React.FormEvent) => {
        e.preventDefault();
        const kVal = parseFloat(kInput);
        const iwVal = parseFloat(idleWeightInput);
        const lrVal = parseFloat(lrInput);

        if (isNaN(kVal) || kVal < 0) {
            toast.error("Hệ số K phải là một số lớn hơn hoặc bằng 0");
            return;
        }
        if (isNaN(iwVal) || iwVal < 0) {
            toast.error("Trọng số Idle Weight phải là một số lớn hơn hoặc bằng 0");
            return;
        }
        if (isNaN(lrVal) || lrVal < 0) {
            toast.error("Tốc độ học (Learning Rate) phải là một số lớn hơn hoặc bằng 0");
            return;
        }

        setUpdating(true);
        try {
            const res = await AISettingService.updateHyperparameters({
                k: kVal,
                idleWeight: iwVal,
                learningRate: lrVal
            });
            if (res) {
                setKInput(res.k.toString());
                setIdleWeightInput(res.idleWeight.toString());
                setLrInput(res.learningRate.toString());
                toast.success("Cập nhật siêu tham số AI thành công");
            }
        } catch (error) {
            console.error(">>> Lỗi khi cập nhật siêu tham số AI:", error);
            toast.error("Lỗi khi cập nhật siêu tham số AI");
        } finally {
            setUpdating(false);
        }
    };

    const handleResetAI = async () => {
        if (!confirm("Bạn có chắc chắn muốn khôi phục siêu tham số AI về mặc định (K=1.5, IdleWeight=0.1, LR=0.01)?")) {
            return;
        }
        setUpdating(true);
        try {
            const res = await AISettingService.resetHyperparameters();
            if (res) {
                setKInput(res.k.toString());
                setIdleWeightInput(res.idleWeight.toString());
                setLrInput(res.learningRate.toString());
                toast.success("Khôi phục siêu tham số AI về mặc định thành công");
            }
        } catch (error) {
            console.error(">>> Lỗi khi reset siêu tham số AI:", error);
            toast.error("Lỗi khi reset siêu tham số AI");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-end">
                <button className="flex items-center gap-2 admin-btn-primary">
                    <Settings className="w-4 h-4"/>
                    Lưu thay đổi
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {
                settingGroups.map((group) => (
                    <Card key={
                            group.title
                        }
                        className="border-none shadow-sm bg-white rounded">
                        <CardHeader className="px-6 py-4 border-b border-gray-100">
                            <CardTitle className="text-base font-bold text-[#2B3674] flex items-center gap-2">
                                <group.icon className="w-5 h-5 text-[#4318FF]"/> {
                                group.title
                            } </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            {
                            group.fields.map((field) => (
                                <div key={
                                        field.label
                                    }
                                    className="flex items-center justify-between gap-4">
                                    <label className="text-sm font-semibold admin-text-primary min-w-0 flex-1">
                                        {
                                        field.label
                                    } </label>
                                    {
                                    field.type === 'toggle' ? (
                                        <span className={
                                            `px-3 py-0.5 rounded-full text-xs font-bold ${
                                                field.value === 'Bật' || field.value === 'Đã bật' || field.value === 'Có' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                                            }`
                                        }>
                                            {
                                            field.value
                                        } </span>
                                    ) : (
                                        <span className="text-sm text-right truncate max-w-[200px]">
                                            {
                                            field.value
                                        } </span>
                                    )
                                } </div>
                            ))
                        } </CardContent>
                    </Card>
                ))
            }

                {/* Cấu hình thuật toán phân bổ AI */}
                <Card className="border-none shadow-sm bg-white rounded lg:col-span-2">
                    <CardHeader className="px-6 py-4 border-b border-gray-100 flex flex-row items-center justify-between">
                        <CardTitle className="text-base font-bold text-[#2B3674] flex items-center gap-2">
                            <Cpu className="w-5 h-5 text-[#4318FF]"/>
                            Cấu hình thuật toán phân bổ AI (Online Learning)
                        </CardTitle>
                        <button 
                            type="button"
                            onClick={handleResetAI}
                            disabled={updating || aiLoading}
                            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-red-600 bg-gray-100 hover:bg-red-50 border border-transparent hover:border-red-200 px-3 py-1.5 rounded transition-all disabled:opacity-50"
                        >
                            <RefreshCw className="w-3.5 h-3.5"/>
                            Khôi phục mặc định
                        </button>
                    </CardHeader>
                    <CardContent className="p-6">
                        {aiLoading ? (
                            <div className="text-sm text-blue-600 animate-pulse py-4">Đang tải cấu hình AI...</div>
                        ) : (
                            <form onSubmit={handleUpdateAI} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold admin-text-primary block">
                                            Hệ số trừng phạt quá tải (k)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={kInput}
                                            onChange={(e) => setKInput(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-200 rounded text-sm font-medium text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#4318FF] focus:border-[#4318FF]"
                                            placeholder="1.50"
                                            required
                                        />
                                        <p className="text-xs text-gray-400 mt-1">
                                            Quyết định mức độ giảm điểm của nhân viên khi đang chịu nhiều tải công việc. Giá trị càng cao phạt càng nặng.
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold admin-text-primary block">
                                            Trọng số thời gian rảnh (IdleWeight)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.001"
                                            value={idleWeightInput}
                                            onChange={(e) => setIdleWeightInput(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-200 rounded text-sm font-medium text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#4318FF] focus:border-[#4318FF]"
                                            placeholder="0.100"
                                            required
                                        />
                                        <p className="text-xs text-gray-400 mt-1">
                                            Cộng điểm ưu tiên cho nhân viên nhàn rỗi lâu ngày (đã được chuẩn hóa bão hòa Tanh).
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold admin-text-primary block">
                                            Tốc độ tự học (Learning Rate - &alpha;)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.0001"
                                            value={lrInput}
                                            onChange={(e) => setLrInput(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-200 rounded text-sm font-medium text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#4318FF] focus:border-[#4318FF]"
                                            placeholder="0.01"
                                            required
                                        />
                                        <p className="text-xs text-gray-400 mt-1">
                                            Độ lớn của bước điều chỉnh tham số sau mỗi sự kiện chốt báo giá thành công hoặc từ chối từ khách hàng.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-2">
                                    <button 
                                        type="submit"
                                        disabled={updating}
                                        className="flex items-center gap-2 admin-btn-primary disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4"/>
                                        Lưu cấu hình AI
                                    </button>
                                </div>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
