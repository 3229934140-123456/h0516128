import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { useApplicationStore } from '@/store/useApplicationStore';
import { useAuthStore } from '@/store/useAuthStore';

const provinces = [
  '北京', '上海', '广东', '江苏', '浙江', '山东', '四川', '湖北', '湖南', '河南',
  '河北', '福建', '安徽', '辽宁', '陕西', '重庆', '天津', '云南', '江西', '广西'
];

const cities: Record<string, string[]> = {
  '北京': ['北京'],
  '上海': ['上海'],
  '广东': ['广州', '深圳', '东莞', '佛山', '珠海'],
  '江苏': ['南京', '苏州', '无锡', '常州', '南通'],
  '浙江': ['杭州', '宁波', '温州', '绍兴', '金华'],
  '山东': ['济南', '青岛', '烟台', '潍坊', '临沂'],
  '四川': ['成都', '绵阳', '德阳', '宜宾', '泸州'],
  '湖北': ['武汉', '宜昌', '襄阳', '荆州', '黄石'],
  '湖南': ['长沙', '株洲', '湘潭', '衡阳', '岳阳'],
  '河南': ['郑州', '洛阳', '南阳', '许昌', '新乡'],
  '河北': ['石家庄', '唐山', '邯郸', '保定', '廊坊'],
  '福建': ['福州', '厦门', '泉州', '漳州', '莆田'],
  '安徽': ['合肥', '芜湖', '蚌埠', '马鞍山', '安庆'],
  '辽宁': ['沈阳', '大连', '鞍山', '抚顺', '锦州'],
  '陕西': ['西安', '咸阳', '宝鸡', '渭南', '汉中'],
  '重庆': ['重庆'],
  '天津': ['天津'],
  '云南': ['昆明', '曲靖', '玉溪', '大理', '丽江'],
  '江西': ['南昌', '赣州', '九江', '上饶', '宜春'],
  '广西': ['南宁', '柳州', '桂林', '梧州', '北海']
};

const investmentRanges = [
  { label: '30万以下', min: 0, max: 300000 },
  { label: '30-50万', min: 300000, max: 500000 },
  { label: '50-80万', min: 500000, max: 800000 },
  { label: '80-100万', min: 800000, max: 1000000 },
  { label: '100万以上', min: 1000000, max: 999999999 },
];

export const ApplicationForm: React.FC = () => {
  const navigate = useNavigate();
  const createApplication = useApplicationStore(state => state.createApplication);
  const registerApplicant = useAuthStore(state => state.registerApplicant);
  
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    idCard: '',
    province: '',
    city: '',
    investmentRange: '',
    investmentAmount: 0,
    experience: '',
    storeArea: undefined as number | undefined,
    agreeTerms: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = 3;

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = '请输入姓名';
    if (!formData.phone.trim()) newErrors.phone = '请输入手机号';
    else if (!/^1[3-9]\d{9}$/.test(formData.phone)) newErrors.phone = '请输入正确的手机号';
    if (!formData.email.trim()) newErrors.email = '请输入邮箱';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = '请输入正确的邮箱';
    if (!formData.idCard.trim()) newErrors.idCard = '请输入身份证号';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.province) newErrors.province = '请选择省份';
    if (!formData.city) newErrors.city = '请选择城市';
    if (!formData.investmentRange) newErrors.investmentRange = '请选择投资预算';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.experience.trim()) newErrors.experience = '请填写相关经验';
    if (!formData.agreeTerms) newErrors.agreeTerms = '请同意加盟条款';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;
    
    setSubmitting(true);
    
    try {
      const selectedRange = investmentRanges.find(r => r.label === formData.investmentRange);
      const amount = formData.investmentAmount || (selectedRange?.max + selectedRange?.min) / 2;
      
      registerApplicant({
        name: formData.name,
        phone: formData.phone,
        email: formData.email
      });
      
      createApplication({
        applicantName: formData.name,
        phone: formData.phone,
        email: formData.email,
        idCard: formData.idCard,
        province: formData.province,
        city: formData.city,
        investmentAmount: amount,
        experience: formData.experience,
        storeArea: formData.storeArea
      });
      
      navigate('/apply/success');
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            返回
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-800">加盟申请</span>
          </div>
          <div className="w-16" />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Progress */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all duration-300 ${
                  s < step 
                    ? 'bg-green-500 text-white' 
                    : s === step 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/30' 
                      : 'bg-gray-200 text-gray-500'
                }`}>
                  {s < step ? <CheckCircle className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-24 h-1 rounded-full transition-all duration-300 ${
                    s < step ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-center gap-16 text-sm text-gray-500">
            <span className={step >= 1 ? 'text-blue-600 font-medium' : ''}>基本信息</span>
            <span className={step >= 2 ? 'text-blue-600 font-medium' : ''}>投资意向</span>
            <span className={step >= 3 ? 'text-blue-600 font-medium' : ''}>经验背景</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">基本信息</h2>
                <p className="text-gray-500">请填写您的个人基本信息，我们将严格保密</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    姓名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${
                      errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="请输入真实姓名"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    手机号 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${
                      errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="请输入手机号"
                    maxLength={11}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    邮箱 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="请输入邮箱地址"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    身份证号 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.idCard}
                    onChange={(e) => handleChange('idCard', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${
                      errors.idCard ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="请输入身份证号"
                    maxLength={18}
                  />
                  {errors.idCard && <p className="text-red-500 text-sm mt-1">{errors.idCard}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">投资意向</h2>
                <p className="text-gray-500">请告诉我们您的投资意向和目标城市</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    意向省份 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.province}
                    onChange={(e) => {
                      handleChange('province', e.target.value);
                      handleChange('city', '');
                    }}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none appearance-none bg-white ${
                      errors.province ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  >
                    <option value="">请选择省份</option>
                    {provinces.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  {errors.province && <p className="text-red-500 text-sm mt-1">{errors.province}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    意向城市 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    disabled={!formData.province}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      errors.city ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  >
                    <option value="">请选择城市</option>
                    {formData.province && cities[formData.province]?.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  可投入资金预算 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {investmentRanges.map((range) => (
                    <button
                      key={range.label}
                      type="button"
                      onClick={() => {
                        handleChange('investmentRange', range.label);
                        handleChange('investmentAmount', (range.min + range.max) / 2);
                      }}
                      className={`px-4 py-3 rounded-xl border-2 font-medium transition-all ${
                        formData.investmentRange === range.label
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
                {errors.investmentRange && <p className="text-red-500 text-sm mt-2">{errors.investmentRange}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  预计店铺面积（可选）
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.storeArea || ''}
                    onChange={(e) => handleChange('storeArea', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none pr-12"
                    placeholder="请输入预计店铺面积"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">㎡</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">经验背景</h2>
                <p className="text-gray-500">请简要介绍您的相关经验，帮助我们更好地评估</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  相关经验介绍 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.experience}
                  onChange={(e) => handleChange('experience', e.target.value)}
                  rows={5}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none ${
                    errors.experience ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="请介绍您的创业经历、行业经验、管理经验等，帮助我们更好地了解您..."
                />
                {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
              </div>

              <div className={`p-4 rounded-xl border-2 ${errors.agreeTerms ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={(e) => handleChange('agreeTerms', e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">
                    我已阅读并同意<a href="#" className="text-blue-600 hover:underline">《加盟条款》</a>和
                    <a href="#" className="text-blue-600 hover:underline">《隐私政策》</a>，
                    承诺所提供的信息真实有效，并同意招商专员与我联系。
                  </span>
                </label>
                {errors.agreeTerms && <p className="text-red-500 text-sm mt-2 ml-8">{errors.agreeTerms}</p>}
              </div>

              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-800 mb-3">申请信息确认</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">姓名：</span>
                    <span className="text-gray-800 font-medium">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">手机号：</span>
                    <span className="text-gray-800 font-medium">{formData.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">意向城市：</span>
                    <span className="text-gray-800 font-medium">{formData.province} {formData.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">投资预算：</span>
                    <span className="text-gray-800 font-medium">{formData.investmentRange}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between mt-10 pt-8 border-t border-gray-100">
            <button
              onClick={prevStep}
              disabled={step === 1 || submitting}
              className="px-8 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一步
            </button>
            
            {step < totalSteps ? (
              <button
                onClick={nextStep}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-800 transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/30"
              >
                下一步
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-500 hover:to-orange-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    提交中...
                  </>
                ) : (
                  '提交申请'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
