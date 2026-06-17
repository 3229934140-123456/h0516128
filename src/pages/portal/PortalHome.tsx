import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  ChevronRight, 
  Star, 
  Shield, 
  GraduationCap, 
  Truck, 
  TrendingUp,
  Users,
  MapPin,
  Phone,
  Mail,
  Menu,
  X
} from 'lucide-react';
import { mockPolicies } from '@/mock/policies';

export const PortalHome: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const brandPolicy = mockPolicies.find(p => p.type === 'brand');
  const feePolicy = mockPolicies.find(p => p.title.includes('费用'));
  const supportPolicy = mockPolicies.find(p => p.type === 'support');

  const advantages = [
    { icon: Star, title: '品牌优势', desc: '10年行业深耕，全国500+门店' },
    { icon: Shield, title: '运营支持', desc: '八大支持体系，全程保驾护航' },
    { icon: GraduationCap, title: '系统培训', desc: '从开店到运营，全面培训指导' },
    { icon: TrendingUp, title: '盈利保障', desc: '60%+毛利率，12-18个月回本' },
  ];

  const stats = [
    { value: '500+', label: '全国门店' },
    { value: '98%', label: '存活率' },
    { value: '60%+', label: '平均毛利' },
    { value: '10年', label: '行业经验' },
  ];

  const cities = ['北京', '上海', '广州', '深圳', '成都', '杭州', '武汉', '西安', '南京', '重庆'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                招商加盟
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#about" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">品牌介绍</a>
              <a href="#advantages" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">加盟优势</a>
              <a href="#policy" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">加盟政策</a>
              <a href="#support" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">支持体系</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">联系我们</a>
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <Link 
                to="/apply"
                className="px-5 py-2.5 bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-500 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-orange-500/25"
              >
                立即申请
              </Link>
              <Link 
                to="/login"
                className="px-5 py-2.5 border-2 border-blue-500 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all"
              >
                登录后台
              </Link>
            </div>

            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4">
            <nav className="flex flex-col gap-4">
              <a href="#about" className="text-gray-600 font-medium py-2">品牌介绍</a>
              <a href="#advantages" className="text-gray-600 font-medium py-2">加盟优势</a>
              <a href="#policy" className="text-gray-600 font-medium py-2">加盟政策</a>
              <a href="#support" className="text-gray-600 font-medium py-2">支持体系</a>
              <a href="#contact" className="text-gray-600 font-medium py-2">联系我们</a>
              <div className="pt-4 flex flex-col gap-3">
                <Link 
                  to="/apply"
                  className="w-full px-5 py-2.5 bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold rounded-xl text-center"
                >
                  立即申请
                </Link>
                <Link 
                  to="/login"
                  className="w-full px-5 py-2.5 border-2 border-blue-500 text-blue-600 font-semibold rounded-xl text-center"
                >
                  登录后台
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-96 h-96 bg-orange-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-blue-400 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid lg:grid-cols-2 gap-12 items-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div>
              <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur text-white/90 rounded-full text-sm font-medium mb-6">
                🔥 2024年招商计划火热进行中
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                共创财富未来<br />
                <span className="text-orange-400">携手开启</span>事业新篇章
              </h1>
              <p className="text-lg text-white/70 mb-8 leading-relaxed">
                10年行业深耕，500+成功门店验证。完善的加盟体系、全方位的运营支持，
                让您的创业之路更加稳健。把握机遇，共赢未来！
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/apply"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-500 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-orange-500/30"
                >
                  立即申请加盟
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <a 
                  href="#policy"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
                >
                  了解加盟费用
                </a>
              </div>

              <div className="mt-12 grid grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-white mb-1" style={{ animationDelay: `${i * 100}ms` }}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-white/60">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:block relative">
              <img 
                src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20retail%20store%20interior%20with%20customers%20bright%20lighting%20professional%20photography&image_size=landscape_16_9"
                alt="门店展示"
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">3,280</p>
                    <p className="text-sm text-gray-500">本月咨询量</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hot Cities */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <MapPin className="w-5 h-5 text-orange-500" />
            <span className="text-gray-600 font-medium">热门招商城市：</span>
            <div className="flex flex-wrap gap-2">
              {cities.map((city, i) => (
                <span 
                  key={i} 
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-orange-100 hover:text-orange-600 transition-colors cursor-pointer"
                >
                  {city}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section id="advantages" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-orange-500 font-semibold">WHY CHOOSE US</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2 mb-4" style={{ fontFamily: 'Noto Serif SC, serif' }}>
              为什么选择我们
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              成熟的运营模式，强大的品牌支持，让您的创业事半功倍
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((item, i) => (
              <div 
                key={i}
                className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-2 group"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl flex items-center justify-center mb-6 group-hover:from-blue-500 group-hover:to-blue-600 transition-all duration-300">
                  <item.icon className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Brand */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <img 
                src={brandPolicy?.coverImage || ''}
                alt="品牌故事"
                className="rounded-3xl shadow-xl"
              />
            </div>
            <div>
              <span className="text-orange-500 font-semibold">BRAND STORY</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2 mb-6" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                品牌故事与企业文化
              </h2>
              <div 
                className="text-gray-600 leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: brandPolicy?.content || '' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Fee Policy */}
      <section id="policy" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-orange-500 font-semibold">INVESTMENT PLAN</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2 mb-4" style={{ fontFamily: 'Noto Serif SC, serif' }}>
              透明的加盟费用
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              无隐藏费用，所有投资明细清晰透明
            </p>
          </div>

          <div 
            className="bg-white rounded-3xl p-8 md:p-12 shadow-lg"
            dangerouslySetInnerHTML={{ __html: feePolicy?.content || '' }}
          />
        </div>
      </section>

      {/* Support System */}
      <section id="support" className="py-20 bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-orange-400 font-semibold">FULL SUPPORT</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4" style={{ fontFamily: 'Noto Serif SC, serif' }}>
              全方位支持体系
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              从选址到开业，从培训到运营，全程保驾护航
            </p>
          </div>

          <div 
            className="bg-white/10 backdrop-blur rounded-3xl p-8 md:p-12"
            dangerouslySetInnerHTML={{ __html: supportPolicy?.content || '' }}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-orange-400 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6" style={{ fontFamily: 'Noto Serif SC, serif' }}>
            准备好开启您的财富之旅了吗？
          </h2>
          <p className="text-white/80 text-lg mb-8">
            现在提交申请，专业招商顾问将在24小时内与您联系
          </p>
          <Link 
            to="/apply"
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-orange-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            立即提交加盟申请
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <span className="text-xl font-bold" style={{ fontFamily: 'Noto Serif SC, serif' }}>招商加盟平台</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                10年行业深耕，致力于为创业者提供优质的加盟机会和全方位的运营支持。
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">联系方式</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-orange-400" />
                  <span className="text-gray-300">400-888-8888</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-orange-400" />
                  <span className="text-gray-300">join@company.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-orange-400" />
                  <span className="text-gray-300">上海市浦东新区XX路XX号</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">快速链接</h3>
              <div className="space-y-3">
                <Link to="/apply" className="block text-gray-400 hover:text-white transition-colors">在线申请</Link>
                <Link to="/login" className="block text-gray-400 hover:text-white transition-colors">登录后台</Link>
                <a href="#policy" className="block text-gray-400 hover:text-white transition-colors">加盟政策</a>
                <a href="#support" className="block text-gray-400 hover:text-white transition-colors">支持体系</a>
              </div>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            © 2024 招商加盟管理平台. All rights reserved.
          </div>
        </div>
      </section>
    </div>
  );
};
