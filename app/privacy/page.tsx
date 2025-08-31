'use client';

import { useRouter } from 'next/navigation';

export default function PrivacyPolicy() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* 헤더 */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-purple-600 hover:text-purple-700 mb-4 flex items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            돌아가기
          </button>
          <h1 className="text-3xl font-bold text-gray-900">개인정보처리방침</h1>
          <p className="text-sm text-gray-600 mt-2">시행일: 2024년 1월 1일</p>
        </div>

        {/* 본문 내용 */}
        <div className="bg-white rounded-2xl p-8 shadow-sm space-y-8">
          {/* 제1조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">제1조 (목적)</h2>
            <p className="text-gray-700 leading-relaxed">
              더파운더(이하 '회사'라 함)은 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하고 
              개인정보와 관련한 이용자의 고충을 원활하게 처리할 수 있도록 다음과 같은 처리방침을 두고 있습니다.
            </p>
          </section>

          {/* 제2조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">제2조 (개인정보의 처리 목적)</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 
              용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 
              이행할 예정입니다.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>비즈니스 가치 측정 서비스 제공</li>
              <li>서비스 개선 및 신규 서비스 개발</li>
              <li>마케팅 및 이벤트 정보 제공 (동의 시)</li>
              <li>고객 문의 대응 및 불만 처리</li>
            </ul>
          </section>

          {/* 제3조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">제3조 (수집하는 개인정보 항목)</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              회사는 다음의 개인정보 항목을 처리하고 있습니다.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div>
                <p className="font-medium text-gray-900 mb-1">필수 수집 항목</p>
                <ul className="list-disc list-inside text-gray-700 ml-4 text-sm">
                  <li>이메일 주소</li>
                  <li>서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">선택 수집 항목</p>
                <ul className="list-disc list-inside text-gray-700 ml-4 text-sm">
                  <li>사업체명, 업종</li>
                  <li>월 매출, 수익, 구독자 수 등 비즈니스 관련 정보</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 제4조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">제4조 (개인정보의 처리 및 보유 기간)</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 
              개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>서비스 이용 기록: 3년</li>
              <li>마케팅 정보 수신 동의: 동의 철회 시까지</li>
              <li>관련 법령에 따른 보관: 해당 법령에서 정한 기간</li>
            </ul>
          </section>

          {/* 제5조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">제5조 (개인정보의 제3자 제공)</h2>
            <p className="text-gray-700 leading-relaxed">
              회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-3">
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
            </ul>
          </section>

          {/* 제6조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">제6조 (정보주체의 권리·의무 및 행사방법)</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>개인정보 열람 요구</li>
              <li>오류 등이 있을 경우 정정 요구</li>
              <li>삭제 요구</li>
              <li>처리정지 요구</li>
            </ul>
          </section>

          {/* 제7조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">제7조 (개인정보의 파기)</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 
              지체없이 해당 개인정보를 파기합니다.
            </p>
            <div className="bg-purple-50 rounded-xl p-4">
              <p className="font-medium text-purple-900 mb-2">파기 절차 및 방법</p>
              <ul className="list-disc list-inside text-purple-700 ml-4 text-sm space-y-1">
                <li>파기 절차: 파기 사유가 발생한 개인정보를 선정하고, 회사의 개인정보 보호책임자의 승인을 받아 개인정보를 파기합니다.</li>
                <li>파기 방법: 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다.</li>
              </ul>
            </div>
          </section>

          {/* 제8조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">제8조 (개인정보의 안전성 확보조치)</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>개인정보 취급 직원의 최소화 및 교육</li>
              <li>내부관리계획의 수립 및 시행</li>
              <li>개인정보의 암호화</li>
              <li>해킹 등에 대비한 기술적 대책</li>
              <li>개인정보에 대한 접근 제한</li>
              <li>접속기록의 보관 및 위변조 방지</li>
            </ul>
          </section>

          {/* 제9조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">제9조 (개인정보 보호책임자)</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 
              불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="font-medium text-gray-900 mb-2">개인정보 보호책임자</p>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>담당자: The Founder Inc. 개인정보보호팀</li>
                <li>연락처: contact@thefounder.kr</li>
              </ul>
            </div>
          </section>

          {/* 제10조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">제10조 (권익침해 구제방법)</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              정보주체는 개인정보침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 
              한국인터넷진흥원 개인정보침해신고센터 등에 분쟁해결이나 상담 등을 신청할 수 있습니다.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <p className="font-medium text-gray-900">개인정보 침해신고 및 상담</p>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>• 개인정보분쟁조정위원회: (국번없이) 1833-6972 (www.kopico.go.kr)</li>
                <li>• 개인정보침해신고센터: (국번없이) 118 (privacy.kisa.or.kr)</li>
                <li>• 대검찰청: (국번없이) 1301 (www.spo.go.kr)</li>
                <li>• 경찰청: (국번없이) 182 (ecrm.cyber.go.kr)</li>
              </ul>
            </div>
          </section>

          {/* 제11조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">제11조 (개인정보 처리방침 변경)</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              이 개인정보 처리방침은 2024년 1월 1일부터 적용됩니다.
            </p>
            <p className="text-gray-700 leading-relaxed">
              회사는 개인정보 처리방침을 변경하는 경우 변경사항을 홈페이지에 공지하고, 
              변경된 처리방침은 공지한 시행일로부터 7일 후부터 효력이 발생합니다.
            </p>
          </section>
        </div>

        {/* 하단 버튼 */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.back()}
            className="px-8 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
          >
            돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}