'use strict';
document.documentElement.classList.add('js');

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#nav');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
}
menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(expanded));
  navigation.classList.toggle('is-open', expanded);
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
window.matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);

// 설명용 로컬 콘텐츠. 거래 데이터와 네트워크 요청은 사용하지 않습니다.
const steps = [
  ['ORDER', '금액의 기준은 서버가 보관합니다.', '주문을 생성하고 서버에서 결제 금액을 관리합니다. 이후 인증·승인 과정에서 전달된 값을 주문 정보와 대조할 기준을 마련합니다.', '클라이언트 입력을 금액의 근거로 신뢰하지 않기'],
  ['CHECKOUT', 'PC 표준결제창에서 인증을 진행합니다.', '브라우저에서 KCP PC 표준결제창을 호출합니다. 사용자는 결제 수단을 선택하고 카드 인증 절차를 진행합니다.', '결제창 인증 완료와 최종 승인 완료를 구분하기'],
  ['CALLBACK', '인증 결과를 검증 경계로 가져옵니다.', '인증 콜백을 전달받아 주문 정보와 금액을 대조합니다. Origin 및 CSRF 검증으로 요청의 유효성을 확인합니다.', '콜백 수신만으로 결제 성공을 확정하지 않기'],
  ['AUTHORIZE', '검증된 요청을 서버에서 승인합니다.', '서버가 KCP 결제승인 API와 연동합니다. 중복 승인과 동시 요청을 제어하고 응답 결과를 확인합니다.', '중복 실행 방지와 불명확한 응답 상태 관리'],
  ['PERSIST', '승인정보를 데이터베이스에 남깁니다.', 'SQLite에 승인정보를 저장해 거래 상태를 보존합니다. 외부 승인과 로컬 저장 사이에 발생할 수 있는 저장 실패도 검증 범위에 포함했습니다.', '외부 승인 성공과 DB 저장 성공을 각각 확인하기'],
  ['RECONCILE', '서명 기반 조회로 상태를 대조합니다.', 'RSA 서명 기반으로 KCP 거래를 조회하고 DB 승인상태와 대조합니다. 실제 KCP 테스트 환경에서 PAID 상태의 일치를 확인했습니다.', '외부 거래상태와 내부 기록의 일치 확인']
];
const stepButtons = [...document.querySelectorAll('.flow-step')];
stepButtons.forEach(button => {
  button.addEventListener('click', () => {
    const index = Number(button.dataset.step);
    const [label, title, description, checkpoint] = steps[index];
    stepButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    document.querySelector('#flow-label').textContent = `STEP ${String(index + 1).padStart(2, '0')} / ${label}`;
    document.querySelector('#flow-title').textContent = title;
    document.querySelector('#flow-description').textContent = description;
    document.querySelector('#flow-check').textContent = checkpoint;
  });
});

if ('IntersectionObserver' in window) {
  const navLinks = [...navigation.querySelectorAll('a')];
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting);
    if (!visible.length) return;
    const id = visible[0].target.id;
    navLinks.forEach(link => {
      if (link.getAttribute('href') === `#${id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-15% 0px -55% 0px' });
  document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
}
