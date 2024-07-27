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
    let replace_text = $(this).val().replace(/[^-0-9]/g, '');
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
      $('.user-check1').trigger('click');
      return false;
    }

    if ($('#memberId').val() == "" && $('#password').val() != "") {
      $('.user-check2').trigger('click');
      return false;
    }

    if ($('#memberId').val() != "" && $('#password').val() == "") {
      $('.user-check3').trigger('click');
      return false;
    }

    if ($('#memberId').val() != userId) {
      $('.user-check4').trigger('click');
      return false;
    }

    if ($('#password').val() != password) {
      $('.user-check5').trigger('click');
      return false;
    }
    
    return true;
  }

  function login() {
    const idInput = document.getElementById('memberId'); //회원번호
    const chkRemember = document.getElementById('remember-id'); //회원번호 저장 여부
    const userId = idInput.value;

    localStorage.setItem(idKey, userId);
    if (chkRemember.checked) {
      localStorage.setItem(rememberChk, userId);
    } else {
      localStorage.removeItem(rememberChk);
    }
  }

  $('#mem_email').hide();
  $('#mem_phone').hide();
  $('.remember-email').hide();
  $('.remember-phone').hide();
  $('.user-check1').hide();
  $('.user-check2').hide();
  $('.user-check3').hide();
  $('.user-check4').hide();
  $('.user-check5').hide();

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