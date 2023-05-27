import clsx from 'clsx';
import styles from './index.module.scss';
import {
  Breadcrumbs,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import moment from 'moment';
import { PhongVe, TaiKhoan } from '~/service';
import { validationStaff } from '~/Validation/validation';
import { toast } from 'react-toastify';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function AddStaff() {
  const navigate = useNavigate();
  const [info, setInfo] = useState({
    name: '',
    address: '',
    date: '',
    sex: '',
    permission: '',
    trangthai: true,
    email: '',
    mataikhoan: '',
    password: '',
    IdPhongVe: '',
  });

  const handleInfoChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const [image, setImage] = useState('');

  const [avatar, setAvatar] = useState();

  const handlePreviewAvatar = (e) => {
    const file = e.target.files[0];
    file.preview = URL.createObjectURL(file);
    setFileToBase(file);
    setAvatar(file);
  };

  const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };

  const [error, setError] = useState({});

  const handleSubmit = async () => {
    setError(validationStaff(info));
    console.log(error);
    if (Object.keys(error).length === 0) {
      // console.log(1);
      const document = await TaiKhoan.register({ position: 'staff', info, image });
      if (document === true) {
        toast.error('Số điện thoại đã tồn tại', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      } else {
        toast.success('Tạo tài khoản thành công!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
        navigate(-1);
      }
    } else {
      toast.error('Vui lòng điền đầy đủ thông tin', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
  };

  const [date, setDate] = useState(moment());
  const [phongve, setPhongve] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const document = await PhongVe.getPhongVe();
      setPhongve(document);
    };
    fetchData().catch(console.error);
  }, []);

  return (
    <div className={clsx(styles.wrapper)}>
      <div
        className=" bg-white d-flex flex-row m-0 text-center justify-content-between border-bottom "
        style={{ height: '50px' }}
      >
        <div className=" d-flex flex-row">
          <Button
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'gray',
            }}
            onClick={() => {
              navigate(-1);
            }}
          >
            <ArrowBack />
          </Button>
          <Breadcrumbs
            aria-label="breadcrumb"
            style={{ marginTop: '13px', fontSize: '0.8rem' }}
          >
            <Link className="text-muted py-3" to="#">
              Danh sách nhân viên
            </Link>
            <Link className="text-muted py-3" to="#">
              Thêm nhân viên
            </Link>
          </Breadcrumbs>
        </div>
      </div>
      <div className="container-fluid">
        <div className="my-3 row py-3">
          <div className="col-xs-12 col-md-12 col-lg-4 ">
            <div className="p-4 h-100 bg-white shadow ">
              <p className="fw-bold text-muted">Hình đại diện</p>
              <div className={clsx(styles.file_upload)}>
                <input type="file" onChange={(e) => handlePreviewAvatar(e)} multiple />
                {avatar ? (
                  <img src={avatar.preview} alt="alt" width="100%" />
                ) : (
                  <img src="https://i.stack.imgur.com/dy62M.png" alt="first" />
                )}
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-md-12 col-lg-8 ">
            <div className="bg-white shadow h-100 p-4">
              <div className="d-flex flex-row my-3 w-100">
                <TextField
                  label="Họ tên"
                  name="name"
                  value={info.name}
                  onChange={handleInfoChange}
                  required
                  className="w-50 me-2"
                  error={error?.name}
                />
                <FormControl className="w-50" error={error?.chucvu}>
                  <InputLabel id="select-label">Chức vụ</InputLabel>
                  <Select
                    labelId="select-label"
                    id="select"
                    className="w-100"
                    label="Chức vụ"
                    name="permission"
                    value={info.permission}
                    onChange={handleInfoChange}
                  >
                    <MenuItem value={1}>Nhân viên quản trị hệ thống</MenuItem>
                    <MenuItem value={2}>Nhân viên bán vé</MenuItem>
                    <MenuItem value={3}>Thuyền Trưởng</MenuItem>
                    <MenuItem value={4}>Thuyền Viên</MenuItem>
                  </Select>
                  {error?.chucvu && <FormHelperText>{error?.chucvu}</FormHelperText>}
                </FormControl>
              </div>
              <div className="d-flex flex-row my-3 w-100">
                <FormControl className="w-50 me-2" error={error?.sex}>
                  <InputLabel id="demo-simple-select-label">Giới tính</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    className="w-100"
                    label="Giới tính"
                    name="sex"
                    value={info.sex}
                    onChange={handleInfoChange}
                  >
                    <MenuItem value="Nữ">Nữ</MenuItem>
                    <MenuItem value="Nam">Nam</MenuItem>
                  </Select>
                  {error?.sex && <FormHelperText>{error?.sex}</FormHelperText>}
                </FormControl>
                <TextField
                  label="Email liên hệ"
                  name="email"
                  value={info.email}
                  onChange={handleInfoChange}
                  className="w-50"
                  required
                  error={error?.email}
                />
              </div>
              <div className="d-flex flex-row my-3 w-100">
                <TextField
                  label="Địa chỉ"
                  name="address"
                  value={info.address}
                  onChange={handleInfoChange}
                  className="w-50 me-2"
                  required
                  error={error?.address}
                />
                <DatePicker
                  error
                  className="w-50"
                  label="Ngày sinh"
                  value={date}
                  onChange={(e) => {
                    setDate(e);
                    setInfo((prev) => ({
                      ...prev,
                      date: moment(date).format('DD/MM/YYYY'),
                    }));
                  }}
                />
              </div>
              <div className="d-flex flex-row my-3 w-100">
                <TextField
                  label="Số điện thoại"
                  name="mataikhoan"
                  value={info.mataikhoan}
                  onChange={handleInfoChange}
                  className="w-50 me-2"
                  required
                  error={error?.mataikhoan}
                />
                <TextField
                  type="password"
                  label="Mật khẩu"
                  name="password"
                  value={info.password}
                  onChange={handleInfoChange}
                  className="w-50"
                  required
                  error={error?.matkhau}
                />
              </div>
              {info.permission === 2 && (
                <FormControl fullWidth>
                  <InputLabel id="select-label">Phòng vé</InputLabel>
                  <Select
                    MenuProps={MenuProps}
                    labelId="select-label"
                    id="select"
                    className="w-100"
                    label="Phòng vé"
                    name="IdPhongVe"
                    value={info.IdPhongVe}
                    onChange={(e) => {
                      setInfo((prev) => ({ ...prev, IdPhongVe: e.target.value }));
                    }}
                  >
                    {phongve.map((value, index) => {
                      return (
                        <MenuItem
                          key={index}
                          value={value.idPhongVe}
                          className="text-uppercase"
                        >
                          {value.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              )}
              <div className="mt-4 d-flex flex-row justify-content-end">
                <Button variant="contained" onClick={handleSubmit}>
                  Thêm mới
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddStaff;
