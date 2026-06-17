import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Building2, Phone, Mail, Clock } from 'lucide-react';

export const ApplySuccess: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Noto Serif SC, serif' }}>
            申请提交成功！
          </h1>
          
          <p className="text-gray-500 mb-8 leading-relaxed">
            感谢您对我们品牌的信任与支持！<br />
            您的加盟申请已成功提交，我们的招商专员将在
            <span className="text-orange-500 font-semibold">24小时内</span>
            与您联系，请保持电话畅通。
          </p>

          <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-800 mb-4">温馨提示</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  招商专员将通过 <strong>400-888-8888</strong> 与您联系，请注意接听
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  相关资料将发送至您填写的邮箱，请注意查收
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  工作时间：周一至周五 9:00-18:00
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link 
              to="/"
              className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-800 transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/30"
            >
              <Building2 className="w-5 h-5" />
              返回招商首页
            </Link>
            
            <Link 
              to="/login"
              className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all"
            >
              登录后台查看进度
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-400">
              如有疑问，请拨打招商热线：<br />
              <span className="text-blue-600 font-semibold text-base">400-888-8888</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
