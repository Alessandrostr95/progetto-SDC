import mintCertification from "./app.js";

(function ($) {
    "use strict";

    /*======================================== [Load select values] */
    loadSelectOptions();

    /*==================================================================
    [ Validate after type ]*/
    $('.validate-input .input100').each(function () {
        $(this).on('blur', function () {
            if (validate(this) == false) {
                showValidate(this);
            }
            else {
                $(this).parent().addClass('true-validate');
            }
        })
    })


    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit', function () {
        const qrcode = {};
        var check = true;

        for (var i = 0; i < input.length; i++) {
            if (validate(input[i]) == false) {
                showValidate(input[i]);
                check = false;
            }
            else
                qrcode[input[i].name] = input[i].value;
        }
        qrcode.tipo_certificazione = $("#tipo_certificazione")[0].value;
        mintCertification(qrcode);
        return check;
    });


    $('.validate-form .input100').each(function () {
        $(this).focus(function () {
            hideValidate(this);
            $(this).parent().removeClass('true-validate');
        });
    });

    function validate(input) {
        if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if ($(input).val().trim() == '') {
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');

        $(thisAlert).append('<span class="btn-hide-validate">&#xf136;</span>')
        $('.btn-hide-validate').each(function () {
            $(this).on('click', function () {
                hideValidate(this);
            });
        });
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();
        $(thisAlert).removeClass('alert-validate');
        $(thisAlert).find('.btn-hide-validate').remove();
    }


    /*==================================================================
    [ Show / hide contact ]*/
    $('.btn-hide-contact100').on('click', function () {
        $('.container-contact100').fadeOut(300);
    });

    $('.btn-show-contact100').on('click', function () {
        $('.container-contact100').fadeIn(300);
    });

    // let certificationTypes;
    // fetch("http://localhost:30303/api/v1/certification/enum/certification_types")
    //     .then(resp => resp.json())
    //     .then(data => console.log(data.data))
    //     .catch(err => alert(err));
    // console.log(certificationTypes);
    // for (let i = 0; i < select.length; i++) {
    //     const option = select[i];
    //     option.text = "ciao";
    //     option.value = "ciao";
    // }
    // console.log(select);

})(jQuery);

async function loadSelectOptions() {
    const select = $('#tipo_certificazione');
    const certificationTypesResp = await fetch("http://localhost:30303/api/v1/certification/enum/certification_types");
    const certificationTypesJson = await certificationTypesResp.json();
    const certificationTypes = certificationTypesJson.data;
    certificationTypes.forEach(type => {
        const option = document.createElement("option");
        option.text = type;
        option.value = type;
        select.append(option);
    });
}