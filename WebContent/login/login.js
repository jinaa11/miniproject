const userId = 1004;
const password = '1234!';

const idKey = "USER-ID";
const rememberChk = "REMEMBER-ID";

// 로그아웃
let urlSearch = new URLSearchParams(location.search);
let type = urlSearch.get('type');
if (type == 'logout') {
  localStorage.removeItem(idKey);
  window.location.replace("/WebContent/main.html");
}

$(function () {
  // 회원번호 저장 클릭 시 저장된 회원번호 불러오기
  const rememberInfo = localStorage.getItem(rememberChk);
  if (rememberInfo != null) {
    $("#memberId").val(rememberInfo);
  }

  // 회원번호 숫자만 입력 가능
  $("#memberId").keyup(function() {    
    var replace_text = $(this).val().replace(/[^-0-9]/g, '');
    $(this).val(replace_text);
  });

  $('form[name="login-form"]').submit(function () {
    if (loginCheck()) {
      login();
      window.location.href = "/WebContent/main.html";
    }
    return false;
  });

  function loginCheck() {
    if ($('#memberId').val() == "" && $('#password').val() == "") {
      alert('회원번호와 비밀번호를 입력해주세요.');
      return false;
    }

    if ($('#memberId').val() == "" && $('#password').val() != "") {
      alert('회원번호를 입력해주세요.');
      return false;
    }

    if ($('#memberId').val() != "" && $('#password').val() == "") {
      alert('비밀번호를 입력해주세요.');
      return false;
    }

    if ($('#memberId').val() != userId) {
      alert('회원번호가 일치하지 않습니다.');
      return false;
    }

    if ($('#password').val() != password) {
      alert('패스워드가 일치하지 않습니다.');
      return false;
    }
    
    return true;
  }

  function login() {
    const idInput = document.getElementById('memberId'); //회원번호
    const chkRemember = document.getElementById('remember-id'); //회원번호 저장 여부 체크박스

    let userId = idInput.value;

    localStorage.setItem(idKey, userId);

    if(chkRemember.checked == true) {
      localStorage.setItem(rememberChk, userId);
    } else {
      localStorage.removeItem(rememberChk);
    }
  }

  $('#mem_email').hide();
  $('#mem_phone').hide();
  $('.remember-email').hide();
  $('.remember-phone').hide();

  $("input[name='loginMethod']").change(function () {
    let type = $(this).val();
    if (type == 'id') {
      $('#mem_email').hide();
      $('#mem_phone').hide();
      $('.remember-email').hide();
      $('.remember-phone').hide();
      $('#mem_id').show();
      $('.remember-id').show();
    } else if (type == 'email') {
      $('#mem_id').hide();
      $('#mem_phone').hide();
      $('.remember-id').hide();
      $('.remember-phone').hide();
      $('#mem_email').show();
      $('.remember-email').show();
    } else {
      $('#mem_id').hide();
      $('#mem_email').hide();
      $('.remember-id').hide();
      $('.remember-email').hide();
      $('#mem_phone').show();
      $('.remember-phone').show();
    }
  });

});