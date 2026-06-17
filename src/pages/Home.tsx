import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, Store, BarChart3, ArrowRight, CheckCircle, Shield, BookOpen } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function Home() {
  const navigate = useNavigate();
  const currentUser = useAuthStore(state => state.currentUser);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin' || currentUser.role === 'agent') {
        navigate('/hq/dashboard', { replace: true });
      } else if (currentUser.role === 'franchisee') {
        navigate('/store/dashboard', { replace: true });
      }
    }
  }, [currentUser, navigate]);

  const features = [
    { icon: <Building2 className="w-8 h-8" />, title: '品牌实力', desc: '多年行业深耕，成熟运营模式' },
    { icon: <Users className="w-8 h-8" />, title: '全程扶持', desc: '从选址到运营，总部全程指导' },
    { icon: <Shield className="w-8 h-8" />, title: '风险保障', desc: '完善的退出机制，降低投资风险' },
    { icon: <BarChart3 className="w-8 h-8" />, title: '数据驱动', desc: '实时经营数据，科学决策' }
  ];

  const processSteps = [
    { step: '01', title: '提交申请', desc: '在线填写意向信息' },
    { step: '02', title: '资质审核', desc: '总部评估加盟资格' },
    { step: '03', title: '签署协议', desc: '双方确认合作条款' },
    { step: '04', title: '开店筹备', desc: '总部支持店面开业' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                招商加盟管理平台
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/portal')}
              className="px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              品牌介绍
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/25"
            >
              登录系统
            </button>
          </div>
        </div>
      </header>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                <CheckCircle className="w-4 h-4" />
                全国开放加盟中
              </div>
              <h2 className="text-5xl font-bold text-gray-800 leading-tight mb-6" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                携手共创<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500">
                  财富未来
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                成熟的商业模式，完善的支持体系。加入我们，开启您的创业之旅，
                与全国数百家加盟商一起分享品牌红利。
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/portal/apply')}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-lg font-semibold rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-xl shadow-orange-500/30"
                >
                  立即申请加盟
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate('/portal')}
                  className="flex items-center gap-2 px-8 py-4 border-2 border-gray-200 text-gray-700 text-lg font-semibold rounded-2xl hover:border-blue-500 hover:text-blue-600 transition-all"
                >
                  <BookOpen className="w-5 h-5" />
                  了解更多
                </button>
              </div>
              <div className="flex items-center gap-8 mt-12">
                <div>
                  <p className="text-3xl font-bold text-gray-800">500+</p>
                  <p className="text-gray-500">全国门店</p>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div>
                  <p className="text-3xl font-bold text-gray-800">98%</p>
                  <p className="text-gray-500">存活率</p>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div>
                  <p className="text-3xl font-bold text-gray-800">12年</p>
                  <p className="text-gray-500">行业经验</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8">
                <div className="grid grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="p-6 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors group">
                      <div className="text-blue-500 mb-4 group-hover:scale-110 transition-transform">
                        {feature.icon}
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-500">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Noto Serif SC, serif' }}>
              加盟流程
            </h3>
            <p className="text-gray-500">简单四步，开启您的创业之路</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-blue-500/30">
                  {step.step}
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">{step.title}</h4>
                <p className="text-gray-500">{step.desc}</p>
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-500 to-gray-200 -translate-x-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h3 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Noto Serif SC, serif' }}>
            准备好开启您的创业之旅了吗？
          </h3>
          <p className="text-blue-100 text-lg mb-8">
            填写加盟意向申请表，我们的招商专员将在24小时内与您联系
          </p>
          <button
            onClick={() => navigate('/portal/apply')}
            className="px-10 py-4 bg-white text-blue-600 text-lg font-semibold rounded-2xl hover:bg-blue-50 transition-all shadow-xl"
          >
            立即申请
          </button>
        </div>
      </section>

      <footer className="py-12 px-6 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <span className="text-white font-semibold">招商加盟管理平台</span>
            </div>
            <p className="text-sm">© 2024 招商加盟管理平台. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
