//Hàm DOM
function dom(element) {
    return document.querySelector(element);
}

function Staff(account, name, email, password, date, salary, jobPosition, timeWork) {
    this.account = account;
    this.name = name;
    this.email = email;
    this.password = password;
    this.date = date;
    this.salary = salary;
    this.jobPosition = jobPosition;
    this.timeWork = timeWork;
}
//Hàm tính lương
Staff.prototype.totalSalary = function () {
    let price = 0;
    if (this.jobPosition === "Sếp") {
        price = this.salary * 3;
    } else if (this.jobPosition === "Trưởng phòng") {
        price = this.salary * 2;
    } else if (this.jobPosition === "Nhân viên") {
        price = this.salary;
    }
    return price;
}
//Hàm xếp loại
Staff.prototype.rank = function () {
    let rank = "";
    if (this.timeWork >= 192) {
        rank = "Xuất sắc";
    } else if (this.timeWork >= 176) {
        rank = "Giỏi";
    } else if (this.timeWork >= 160) {
        rank = "Khá";
    } else if (this.timeWork < 160) {
        rank = "Trung bình";
    }
    return rank;
}
//Show thông báo kết quả nhập của user
let show = document.getElementsByClassName('sp-thongbao');
for (let i = 0; i < show.length; i++) {
    show[i].style.display = "block";
}
//array chứa thông tin nhân viên
let staffs = [];
init();
function init() {
    //khi chuyển từ JSON 
    staffs = JSON.parse(localStorage.getItem("staffs")) || [];
    staffs = staffs.map((staff) => {
        return new Staff(
            staff.account,
            staff.name,
            staff.email,
            staff.password,
            staff.date,
            staff.salary,
            staff.jobPosition,
            staff.timeWork);
    });
    display(staffs);
}
//Hàm thêm nhân viên
function addStaff() {
    let account = dom("#tknv").value;
    let name = dom("#name").value;
    let email = dom("#email").value;
    let password = dom("#password").value;
    let date = dom("#datepicker").value;
    let salary = +dom("#luongCB").value;
    let jobPosition = dom("#chucvu").value;
    let timeWork = +dom("#gioLam").value;
    let checkForm = validateForm();
    if (!checkForm) {
        return;
    }
    let staff = new Staff(account, name, email, password, date, salary, jobPosition, timeWork)
    staffs.push(staff);
    localStorage.setItem("staffs", JSON.stringify(staffs));
    deleteForm();
    display(staffs);
}

//Hàm xóa nhân viên
function deleteStaff(accountStaff) {
    staffs = staffs.filter((staff) => {
        return staff.account !== accountStaff;
    })
    //Lưu trữ vào localStorage
    localStorage.setItem("staffs", JSON.stringify(staffs));
    deleteForm();
    dom("#tknv").disabled = false;
    dom("#btnThemNV").disabled = false;
    display(staffs);
}
//Hàm hiển thị
function display(staffs) {
    let html = staffs.reduce((result, staff) => {
        return result + `
            <tr>
                <td>${staff.account}</td>
                <td>${staff.name}</td>
                <td>${staff.email}</td>
                <td>${staff.date}</td>
                <td>${staff.jobPosition}</td>
                <td>${staff.totalSalary()}</td>
                <td>${staff.rank()}</td>
                <td>
                <button 
                 class = 'btn btn-success'
                 onclick = "selectForm('${staff.account}')"
                 >Update</button>
                 <button 
                 class = 'btn btn-danger'
                 onclick = "deleteStaff('${staff.account}')"
                 >Delete</button>
                </td>
            </tr>
        `
    }, "")
    dom('#tableDanhSach').innerHTML = html;
}
//Hàm xóa form
function deleteForm() {
    dom("#tknv").value = "";
    dom("#name").value = "";
    dom("#email").value = "";
    dom("#password").value = "";
    dom("#datepicker").value = "";
    dom("#luongCB").value = "";
    dom("#chucvu").value = "";
    dom("#gioLam").value = "";
    dom("#tknv").disabled = false;
    dom("#btnThemNV").disabled = false;
}
//Hàm fill thông tin lại khung nhập
function selectForm(accountStaff) {
    let staff = staffs.find((staff) => {
        return staff.account === accountStaff;
    });
    if (!staff) {
        return;
    }
    dom("#tknv").value = staff.account;
    dom("#name").value = staff.name;
    dom("#email").value = staff.email;
    dom("#password").value = staff.password;
    dom("#datepicker").value = staff.date;
    dom("#luongCB").value = staff.salary;
    dom("#chucvu").value = staff.jobPosition;
    dom("#gioLam").value = staff.timeWork;
    dom("#tknv").disabled = true;
    dom("#btnThemNV").disabled = true;
}
//Hàm cập nhật
function updateStaff() {
    let account = dom("#tknv").value;
    let name = dom("#name").value;
    let email = dom("#email").value;
    let password = dom("#password").value;
    let date = dom("#datepicker").value;
    let salary = +dom("#luongCB").value;
    let jobPosition = dom("#chucvu").value;
    let timeWork = +dom("#gioLam").value;

    let index = staffs.findIndex((staff) => {
        return staff.account === account;
    });
    let staff = new Staff(account, name, email, password, date, salary, jobPosition, timeWork);
    staffs[index] = staff;
    localStorage.setItem("staffs", JSON.stringify(staffs));
    display(staffs);
    deleteForm();
}
//Hàm kiểm tra tài khoản
function validateAccount() {
    let account = dom("#tknv").value;
    let spanEL = dom("#tbTKNV");
    if (!account) {
        spanEL.innerHTML = "Tài khoản không được để trống"
        return false;
    }
    let regexNumber = /[0-9]{4,6}$/;
    let regexSpace = /^\S+$/;
    if (!regexNumber.test(account) || account.length < 4 || account.length > 6 || !regexSpace.test(account)) {
        spanEL.innerHTML = "Tài khoản tối đa 4 - 6 ký số"
        return false;
    }
    spanEL.innerHTML = "";
    return true;
}
//Hàm kiểm tra name
function validateName() {
    let name = dom("#name").value;
    let spanEL = dom("#tbTen");
    if (!name) {
        spanEL.innerHTML = "Tên không được để trống";
        return false;
    }
    let hasNumberInName = /^([^0-9]*)$/;
    if (!hasNumberInName.test(name)) {
        spanEL.innerHTML = "Tên không được có ký số";
        return false;
    }
    let regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]$/
    if (regex.test(name)) {
        spanEL.innerHTML = "Tên không được có kí tự đặc biệt";
        return false;
    }
    spanEL.innerHTML = "";
    return true;
}
//Hàm kiểm tra email
function validateEmail() {
    let email = dom("#email").value;
    let spanEL = dom("#tbEmail");
    if (!email) {
        spanEL.innerHTML = "Email không được để trống";
        return false;
    }
    let regex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!regex.test(email)) {
        spanEL.innerHTML = "Email không đúng định dạng";
        return false;
    }
    spanEL.innerHTML = "";
    return true;
}
//Hàm kiểm tra password
function validatePassword() {
    let password = dom("#password").value;
    let spanEL = dom("#tbMatKhau");
    if (!password) {
        spanEL.innerHTML = "Mật khẩu không được để trống";
        return false;
    }
    let regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?*]).{6,10}$/;
    if (!regex.test(password)) {
        spanEL.innerHTML = "Mật Khẩu từ 6-10 ký tự (chứa ít nhất 1 ký tự số, 1 ký tự in hoa, 1 ký tự đặc biệt)";
        return false;
    }
    spanEL.innerHTML = "";
    return true;
}
//Hàm kiểm tra ngày
function validateDate() {
    let date = dom("#datepicker").value;
    let spanEL = dom("#tbNgay");
    if (!date) {
        spanEL.innerHTML = "Ngày làm không được để trống";
        return false;
    }
    let regex = /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/;
    if (!regex.test(date)) {
        spanEL.innerHTML = "Định dạng mm/dd/yyyy";
        return false;
    }
    spanEL.innerHTML = "";
    return true;
}
//hàm kiểm tra lương
function validateSalary() {
    let salary = +dom("#luongCB").value;
    let spanEL = dom("#tbLuongCB");
    if (!salary) {
        spanEL.innerHTML = "Lương không được để trống";
        return false;
    }
    if (salary < 1e+6 || salary > 20000000) {
        spanEL.innerHTML = "Nhập lương từ 1.000.000 - 20.000.000";
        return false;
    }
    spanEL.innerHTML = "";
    return true;
}
//Hàm kiểm tra chức vụ
function validateJobPosition() {
    let jobPosition = dom("#chucvu").value;
    let spanEL = dom("#tbChucVu");
    if (!jobPosition) {
        spanEL.innerHTML = "Vui lòng chọn chức vụ";
        return false;
    }
    spanEL.innerHTML = "";
    return true;
}
//Hàm kiểm tra giờ làm
function validateTimeWork() {
    let timeWork = +dom("#gioLam").value;
    let spanEL = dom("#tbGiolam");
    if (!timeWork) {
        spanEL.innerHTML = "Giờ làm không được để trống";
        return false;
    }
    if (timeWork < 80 || timeWork > 200) {
        spanEL.innerHTML = "Nhập giờ làm từ 80 - 200 giờ";
        return false;
    }
    spanEL.innerHTML = "";
    return true;
}
//Hàm kiểm tra form
function validateForm() {
    let checkForm = true;
    checkForm =
        validateAccount() &
        validateName() &
        validateEmail() &
        validatePassword() &
        validateDate() &
        validateSalary() &
        validateJobPosition() &
        validateTimeWork();
    if (!checkForm) {
        return false;
    }
    return true;
}

function searchRankStaff() {
    let rankStaff = dom("#searchName").value;
    rankStaff = rankStaff.toLowerCase();
    if (rankStaff === "") {
        display(staffs);
        return;
    }
    let newStaff = staffs.filter((staff) => {
        let rank = staff.rank().toLowerCase();
        return rank.includes(rankStaff);
    })
    display(newStaff);
}