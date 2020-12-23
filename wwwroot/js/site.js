function Personal() {
    $(function () {
        var gender = $("input[name='loan']");
        var age = $('#Age').val();
        var provinceid = $('#Provinces').val();
        var cityid = $('#City').val();
        var url = $('#Url').val();

        var value = 0;
        for (var i = 0; i < gender.length; i++) {
            if (gender[i].checked == true) {
                value = document.getElementsByName("loan")[i].value;
            }
        }
        var image = document.getElementById('Image');
        var reader = new FileReader();
        if (image.value != "") {
            var file = image.files[0];
            reader.readAsDataURL(file);
            reader.onload = function () {
                var src1 = reader.result;
                var img = document.getElementById('img');
                img.src = src1;
            }
        }

        if (age == "") {
            alert("年龄不能为空");
            return;
        }

        if (age < 2 || age > 120 || isNaN(age) == true) {
            alert("输入年龄格式不正确！请重新输入");
            return;
        }
        if (url == "") {
            alert("Url不能为空");
            return;
        }
        var reg = /^((http|https):\/\/)?(([A-Za-z0-9]+-[A-Za-z0-9]+|[A-Za-z0-9]+)\.)+([A-Za-z]+)[/\?\:]?.*$/;
        if (!reg.test(url)) {
            alert("网址不正确哦,请重新输入");
            return;
        }
        var province = document.getElementById('Provinces');
        var city = document.getElementById('City');
        var index = province.selectedIndex;
        var provinceid = province.options[index].value;
        var cindex = city.selectedIndex;
        var cityid = city.options[cindex].value;

        var item = {
            Gender: value,
            Age: age,
            Province: provinceid,
            City: cityid,
            Image: img.src,
            Url: url
        };

        var urlinfo = window.location.href;  //获取当前页面的url
        console.log(urlinfo)
        var len = urlinfo.split("?");//获取url的长度
        newsidinfo = len[1];
        console.log(newsidinfo);
        var newsids = newsidinfo.split("&");//对获得的参数字符串按照“=”进行分割
        parameter1 = newsids[0];
        os = parameter1.split("=")[1];

        $.ajax({

            url: 'https://localhost:5001/api/PostPersonal' + '?id=' + os,
            type: "POST",
            dataType: "json",
            contentType: 'application/json',
            data: JSON.stringify(item),
            success: function (item) {
                alert("修改成功！");
            }
        })
    })
}

function GetPersonal() {
    $(function () {
        var urlinfo = window.location.href;  //获取当前页面的url
        console.log(urlinfo)
        var len = urlinfo.split("?");//获取url的长度
        newsidinfo = len[1];
        console.log(newsidinfo);
        var newsids = newsidinfo.split("&");//对获得的参数字符串按照“=”进行分割
        parameter1 = newsids[0];
        os = parameter1.split("=")[1];
        $.ajax({
            url: 'https://localhost:5001/api/Personal' + '?id=' + os,
            type: "GET",
            dataType: "json",
            contentType: 'application/json',
            success: function (item) {
                console.log(item);
                if (item.gender == "男") {
                    $('#Gender1').attr("checked", "checked");
                }
                if (item.gender == "女") {
                    $('#Gender2').attr("checked", "checked");
                }
                $('#Age').val(item.age);
                $('#Provinces').val(item.provinces);
                $('#City').val(item.city);
                document.getElementById('img').src = item.fileUrl;
                $('#Url').val(item.url);

                $.ajax({
                    url: 'https://localhost:5001/api/Province',
                    type: 'POST',
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
                        console.log(data);
                        var pro = $('#Provinces').val();
                        if (data != null) {
                            if ($('#Provinces').val() != null) {
                                $('#Provinces').empty();
                            }
                            for (var i in data) {
                                $("#Provinces").append("<option value='" + data[i].id + "'>" + data[i].name + "</option>");
                                if (data[i].id == pro) {
                                    $("#Provinces").val(pro);
                                }
                            }
                        }
                    }
                })
                var province = document.getElementById('Provinces');
                var index = province.selectedIndex;
                var value = province.options[index].value;
                $.ajax({
                    url: 'https://localhost:5001/api/City' + '?parentid=' + value,
                    type: 'GET',
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
                        console.log(data);
                        if (data != null) {
                            for (var i in data) {
                                $("#City").append("<option value='" + data[i].id + "'>" + data[i].name + "</option>");
                                if (data[i].id == item.city) {
                                    $("#City").val(item.city);
                                }
                            }
                        }
                    }
                })
            }
        })
    })
}
