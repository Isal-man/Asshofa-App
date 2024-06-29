import { useEffect, forwardRef, useRef } from "react";
import { MiniDrawer } from "../components";
import {
  AppBar,
  Button,
  Dialog,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Slide,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { APP_BACKEND } from "../config/constant";
import api from "../services/AxiosInterceptor";
import { Pagination, Alert, LoadingButton, Autocomplete } from "@mui/lab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faPenToSquare,
  faTrash,
  faXmark,
  faUserPlus,
  faCircleInfo,
  faFloppyDisk,
} from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import {
  TimePicker,
  LocalizationProvider,
  DatePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useCallback } from "react";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const JadwalPengajaranPage = () => {
  const timer = useRef(null);
  const [rows, setRows] = useState([]);
  const [mataPelajaran, setMataPelajaran] = useState([]);
  const [pengajar, setPengajar] = useState([]);
  const [penilaian, setPenilaian] = useState([]);
  const [total, setTotal] = useState();
  const [totalPenilaian, setTotalPenilaian] = useState();
  const [notification, setNotification] = useState("");
  const [jadwalPengajaranId, setJadwalPengajaranId] = useState("");
  const [penilaianId, setPenilaianId] = useState("");
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isDetail, setIsDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [warning, setIsWarning] = useState(false);
  const [isTambahPelajar, setIsTambahPelajar] = useState(false);
  const [bodyPenilaian, setBodyPenilaian] = useState({
    idSantri: "",
    idJadwal: "",
    nilai: 0,
    namaPelajar: "",
    tanggalPenilaian: new Date(),
  });
  const [jadwalPengajaran, setJadwalPengajaran] = useState({
    hari: "",
    jamMulai: dayjs().set("hour", 0).startOf("hour"),
    jamSelesai: dayjs().set("hour", 0).startOf("hour"),
    mataPelajaran: "",
    namaPengajar: "",
    idPengajar: "",
  });
  const [param, setParam] = useState({
    hari: "",
    jamMulai: "",
    jamSelesai: "",
    mataPelajaran: "",
    page: 1,
    limit: 10,
  });
  const [paramPenilaian, setParamPenilaian] = useState({
    idJadwal: "",
    namaPelajar: "",
    page: 1,
    limit: 10,
  });

  const columns = [
    {
      id: "pengajar",
      label: "Pengajar",
      minWidth: 100,
    },
    {
      id: "mataPelajaran",
      label: "Mata Pelajaran",
      minWidth: 100,
      filter: (
        <TextField
          id="outlined-basic"
          label="Mata Pelajaran"
          variant="outlined"
          className="w-full"
          onBlur={(e) => handleMataPelajaran(e)}
        />
      ),
    },
    {
      id: "hari",
      label: "Hari",
      minWidth: 100,
      filter: (
        <TextField
          id="outlined-basic"
          label="Hari"
          variant="outlined"
          className="w-full"
          onBlur={(e) => handleHari(e)}
        />
      ),
    },
    {
      id: "jamMulai",
      label: "Jam Mulai",
      minWidth: 100,
    },
    {
      id: "jamSelesai",
      label: "Jam Selesai",
      minWidth: 100,
    },
    {
      id: "action",
      label: "Action",
      minWidth: 100,
    },
  ];

  const columnsPelajar = [
    {
      id: "namaPelajar",
      label: "Nama Pelajar",
      minWidth: 250,
      filter: (
        <TextField
          id="outlined-basic"
          label="Nama Pelajar"
          variant="outlined"
          className="w-full"
          onBlur={(e) => handleNamaPelajar(e)}
        />
      ),
    },
    {
      id: "nilai",
      label: "Nilai",
      minWidth: 250,
    },
    {
      id: "tanggalPenilaian",
      label: "Tanggal Penilaian",
      minWidth: 250,
    },
    {
      id: "action",
      label: "Action",
      minWidth: 250,
    },
  ];

  useEffect(() => {
    load({ ...param });
    loadMataPelajaran();

    const validJamMulai = dayjs(jadwalPengajaran.jamMulai);
    const validJamSelesai = dayjs(jadwalPengajaran.jamSelesai);

    if (validJamMulai.isAfter(validJamSelesai)) setIsWarning(true);
    else setIsWarning(false);

    console.log(warning, "masuk bos");
  }, [jadwalPengajaran.jamMulai, jadwalPengajaran.jamSelesai]);

  const load = async (props) => {
    const { hari, mataPelajaran, page, limit } = props;

    const request = await api.get(
      APP_BACKEND +
        `/jadwal-pengajaran/get-list-jadwal-pengajaran?hari=${hari}&mataPelajaran=${mataPelajaran}&page=${page}&limit=${limit}`
    );
    const response = await request.data;
    const data = response?.data?.list;
    const count = response?.data?.total;
    setRows(data);
    setTotal(count);
  };

  const loadMataPelajaran = async () => {
    const request = await api.get(
      APP_BACKEND + `/mata-pelajaran/get-list-mata-pelajaran`
    );
    const response = await request.data;
    const data = response?.data;
    setMataPelajaran(data);
  };

  const loadPengajar = async (param) => {
    const request = await api.get(
      APP_BACKEND +
        `/pengajar/get-pengajar-by-spesialisasi?idSpesialisasi=${param}`
    );
    const response = await request.data;
    const data = response?.data;
    setPengajar(data);
  };

  const loadPenilaian = async (props) => {
    const { idJadwal, namaPelajar, page, limit } = props;

    const request = await api.get(
      APP_BACKEND +
        `/penilaian/get-list-penilaian?idJadwal=${idJadwal}&namaPelajar=${namaPelajar}&page=${page}&limit=${limit}`
    );
    const response = await request.data;
    const data = response?.data?.list;
    const count = response?.data?.total;
    setPenilaian(data);
    setTotalPenilaian(count);
  };

  const handleMataPelajaran = (e) => {
    setRows([]);
    load({ ...param, page: 1, mataPelajaran: e.target.value });
    setParam({ ...param, page: 1, mataPelajaran: e.target.value });
  };

  const handleNamaPelajar = (e) => {
    setRows([]);
    load({ ...paramPenilaian, page: 1, namaPelajar: e.target.value });
    setParamPelajar({ ...param, page: 1, namaPelajar: e.target.value });
  };

  const handleHari = (e) => {
    setRows([]);
    load({ ...param, page: 1, hari: e.target.value });
    setParam({ ...param, page: 1, hari: e.target.value });
  };

  const handleChangePage = (_e, value, flag) => {
    flag == "jadwal" ? setRows([]) : setPenilaian([]);
    flag == "jadwal"
      ? load({ ...param, page: value })
      : loadPenilaian({ ...paramPenilaian, page: value });
    flag == "jadwal"
      ? setParam({ ...param, page: value })
      : loadPenilaian({ ...paramPenilaian, page: value });
  };

  const handleLimitChange = (e, flag) => {
    flag == "jadwal" ? setRows([]) : setPenilaian([]);
    flag == "jadwal"
      ? load({ ...param, page: 1, limit: e.target.value })
      : loadPenilaian({ ...paramPenilaian, page: 1, limit: e.target.value });
    flag == "jadwal"
      ? setParam({ ...param, page: 1, limit: e.target.value })
      : setParamPenilaian({
          ...paramPenilaian,
          page: 1,
          limit: e.target.value,
        });
  };

  const handleInputMapel = (_e, value) => {
    setJadwalPengajaran({
      ...jadwalPengajaran,
      mataPelajaran: value?.nama,
    });
    const spesialisasi = handleValueMapel(value?.nama);
    loadPengajar(spesialisasi?.idSpesialisasi);
  };

  const handleUpdate = (data) => {
    setIsUpdate(true);
    setOpen(true);
    setJadwalPengajaran(data);
    setJadwalPengajaranId(data?.id);
  };

  const handleUpdatePenilaian = (data) => {
    setPenilaianId(data?.id);
    setIsUpdate(true);
    setBodyPenilaian({...data, idJadwal: jadwalPengajaranId})
  };

  const handleDetail = (idJadwal) => {
    setIsDetail(true);
    setOpen(true);
    loadPenilaian({ ...paramPenilaian, idJadwal });
    setJadwalPengajaranId(idJadwal)
  };

  const handleDelete = async (jadwalPengajaranId) => {
    const request = await api.delete(
      APP_BACKEND + `/jadwal-pengajaran/delete?id=${jadwalPengajaranId}`
    );
    const response = await request?.data?.detail;
    setNotification(response);
    setRows([]);
    load({ ...param });
    setOpenAlert(true);
  };

  const handleDeletePenilaian = async (penilaianId) => {
    const request = await api.delete(
      APP_BACKEND + `/penilaian/delete?id=${penilaianId}`
    );
    const response = await request?.data?.detail;
    setNotification(response);
    setRows([]);
    loadPenilaian({ ...paramPenilaian, idJadwal: jadwalPengajaranId });
    setOpenAlert(true);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleTambahPelajar = () => {
    setIsTambahPelajar(true);
    setBodyPenilaian({...bodyPenilaian, idJadwal: jadwalPengajaranId})
  };

  const handleCloseTambahPelajar = () => {
    setIsTambahPelajar(false);
  };

  const handleClose = () => {
    setOpen(false);
    setIsUpdate(false);
    setIsDetail(false);
    setJadwalPengajaran({
      hari: "",
      jamMulai: dayjs().set("hour", 0).startOf("hour"),
      jamSelesai: dayjs().set("hour", 0).startOf("hour"),
      mataPelajaran: "",
      namaPengajar: "",
      idPengajar: "",
    });
  };

  const handleCloseNotif = () => {
    setOpenAlert(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const jamMulai = dayjs(jadwalPengajaran.jamMulai).format("HH:mm:ss");
    const jamSelesai = dayjs(jadwalPengajaran.jamSelesai).format("HH:mm:ss");

    const updateBody = { ...jadwalPengajaran, jamMulai, jamSelesai };

    const method = isUpdate
      ? api.put(
          `/jadwal-pengajaran/update?id=${jadwalPengajaranId}`,
          updateBody
        )
      : api.post(APP_BACKEND + "/jadwal-pengajaran/create", updateBody);

    const request = await method;

    const response = await request?.data?.detail;

    setLoading(false);
    setOpen(false);
    setNotification(response);
    setRows([]);
    load({ ...param });
    setOpenAlert(true);
    setJadwalPengajaran({
      hari: "",
      jamMulai: dayjs().set("hour", 0).startOf("hour"),
      jamSelesai: dayjs().set("hour", 0).startOf("hour"),
      mataPelajaran: "",
      namaPengajar: "",
      idPengajar: "",
    });
  };

  const handleSubmitPenilaian = async (e) => {
    e.preventDefault();
    const request = await api.get(
      APP_BACKEND +
        `/santri/get-santri-by-nama?nama=${bodyPenilaian.namaPelajar}`
    );
    const response = await request?.data;
    const idSantri = await response?.data?.id;

    const updateBody = {...bodyPenilaian, idSantri}

    const method = isUpdate
      ? api.put(`/penilaian/update?id=${penilaianId}`, updateBody)
      : api.post(APP_BACKEND + "/penilaian/create", updateBody);

    const requestSubmit = await method;

    const responseSubmit = await requestSubmit?.data?.detail;
    const data = await requestSubmit?.data?.data;

    setLoading(false);
    setNotification(responseSubmit);
    setPenilaian(isUpdate ? [] : [data, ...penilaian]);
    isUpdate && loadPenilaian({ ...paramPenilaian, idJadwal: jadwalPengajaranId });
    setOpenAlert(true);
    setIsTambahPelajar(false)
    setPenilaianId("")
    setBodyPenilaian({
      idSantri: "",
      idJadwal: "",
      nilai: 0,
      namaPelajar: "",
      tanggalPenilaian: new Date(),
    });
  };

  const handleValueMapel = (param) => {
    let i = 0;
    mataPelajaran?.map((e, idx) => {
      if (e.nama === param) i = idx;
    });
    return param ? mataPelajaran[i] : null;
  };

  const handleValuePengajar = (param) => {
    let i = 0;
    pengajar?.map((e, idx) => {
      if (e.nama === param) i = idx;
    });
    return param ? pengajar[i] : null;
  };

  const handleSelectPelajar = useCallback((callback, delay) => {
    return (event) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        callback(event);
      }, delay);
    };
  }, []);

  const getData = (event, flag) => {};

  const debouncedHandleChange = handleSelectPelajar(getData, 3000);

  return (
    <>
      <div className="flex justify-center items-center h-screen w-screen bg-gray-200">
        <MiniDrawer />
        <div className="flex flex-col mt-14 mr-4 h-5/6 w-full p-4 bg-gray-50 rounded-md">
          <div className="flex justify-between w-full p-2">
            <p className="font-bold text-3xl">Data Jadwal Pengajaran</p>
            <Button
              variant="contained"
              className="h-10 w-90"
              startIcon={<FontAwesomeIcon icon={faCirclePlus} />}
              onClick={handleClickOpen}
            >
              Tambah Data Jadwal Pengajaran
            </Button>
          </div>
          <Divider />
          <div className="h-5/6">
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <TableContainer sx={{ maxHeight: 500 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          style={{ minWidth: column.width }}
                          align="center"
                        >
                          <div className="flex flex-col items-start gap-4">
                            {column.label}
                            {column.filter}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell style={{ minWidth: 100 }} align="left">
                          {row.namaPengajar}
                        </TableCell>
                        <TableCell style={{ minWidth: 100 }} align="left">
                          {row.mataPelajaran}
                        </TableCell>
                        <TableCell style={{ minWidth: 100 }} align="left">
                          {row.hari}
                        </TableCell>
                        <TableCell style={{ minWidth: 100 }} align="left">
                          {row.jamMulai}
                        </TableCell>
                        <TableCell style={{ minWidth: 100 }} align="left">
                          {row.jamSelesai}
                        </TableCell>
                        <TableCell style={{ minWidth: 100 }} align="left">
                          <IconButton onClick={() => handleUpdate(row)}>
                            <FontAwesomeIcon
                              icon={faPenToSquare}
                              className="text-cyan-500"
                            />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(row.id)}>
                            <FontAwesomeIcon
                              icon={faTrash}
                              className="text-red-500"
                            />
                          </IconButton>
                          <IconButton onClick={() => handleDetail(row.id)}>
                            <FontAwesomeIcon
                              icon={faCircleInfo}
                              className="text-cyan-500"
                            />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow style={{ width: "100%" }}>
                      <TableCell
                        colSpan={columns.length}
                        style={{ width: "100%" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                            gap: 4,
                          }}
                        >
                          <Pagination
                            count={Math.ceil(total / param.limit)}
                            page={param.page}
                            onChange={() => handleChangePage("jadwal")}
                          />
                          <Select
                            labelId="limit"
                            id="limit"
                            value={param.limit}
                            label="Limit"
                            onChange={() => handleLimitChange("jadwal")}
                          >
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                            <MenuItem value={30}>30</MenuItem>
                            <MenuItem value={40}>40</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                          </Select>
                          <p className="text-base text-black">Total {total}</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Paper>
          </div>
        </div>
      </div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <FontAwesomeIcon icon={faXmark} />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {isUpdate
                ? "Form Update Jadwal Pengajaran"
                : isDetail
                ? "Detail Jadwal Pengajaran"
                : "Form Tambah Jadwal Pengajaran"}
            </Typography>
          </Toolbar>
          <Paper
            className="flex flex-col items-center gap-4 p-2 h-full"
            elevation={3}
          >
            {isDetail ? (
              <>
                <div className="flex flex-col mt-14 mr-4 h-5/6 w-full p-4 bg-gray-50 rounded-md">
                  <div className="flex justify-between w-full p-2">
                    <p className="font-bold text-3xl">Data Pelajar</p>
                    <Button
                      variant="contained"
                      className="h-10 w-90"
                      startIcon={<FontAwesomeIcon icon={faCirclePlus} />}
                      onClick={handleTambahPelajar}
                    >
                      Tambah Data Pelajar
                    </Button>
                  </div>
                  <Divider />
                  <div className="h-5/6">
                    <Paper sx={{ width: "100%", overflow: "hidden" }}>
                      <TableContainer sx={{ maxHeight: 500 }}>
                        <Table stickyHeader aria-label="sticky table">
                          <TableHead>
                            <TableRow>
                              {columnsPelajar.map((column) => (
                                <TableCell
                                  key={column.id}
                                  style={{ minWidth: column.width }}
                                  align="center"
                                >
                                  <div className="flex flex-col items-start gap-4">
                                    {column.label}
                                    {column.filter}
                                  </div>
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {isTambahPelajar && (
                              <>
                                <TableRow>
                                  <TableCell
                                    style={{ minWidth: 100 }}
                                    align="left"
                                  >
                                    <TextField
                                      id="namaPelajar"
                                      variant="standard"
                                      onChange={(e) =>
                                        setBodyPenilaian({
                                          ...bodyPenilaian,
                                          namaPelajar: e.target.value,
                                        })
                                      }
                                    />
                                  </TableCell>
                                  <TableCell
                                    style={{ minWidth: 100 }}
                                    align="left"
                                  >
                                    <TextField
                                      id="nilai"
                                      variant="standard"
                                      onChange={(e) =>
                                        setBodyPenilaian({
                                          ...bodyPenilaian,
                                          nilai: e.target.value,
                                        })
                                      }
                                    />
                                  </TableCell>
                                  <TableCell
                                    style={{ minWidth: 100 }}
                                    align="left"
                                  >
                                    <LocalizationProvider
                                      dateAdapter={AdapterDayjs}
                                    >
                                      <DatePicker
                                        label="Tanggal Penilaian"
                                        defaultValue={dayjs(
                                          new Date().getTime()
                                        )}
                                        onChange={(e) =>
                                          setBodyPenilaian({
                                            ...bodyPenilaian,
                                            tanggalPenilaian: e?.$d,
                                          })
                                        }
                                      />
                                    </LocalizationProvider>
                                  </TableCell>
                                  <TableCell
                                    style={{ minWidth: 100 }}
                                    align="left"
                                  >
                                    <IconButton>
                                      <FontAwesomeIcon
                                        icon={faFloppyDisk}
                                        className="text-cyan-500"
                                        onClick={handleSubmitPenilaian}
                                      />
                                    </IconButton>
                                    <IconButton>
                                      <FontAwesomeIcon
                                        icon={faTrash}
                                        className="text-red-500"
                                        onClick={handleCloseTambahPelajar}
                                      />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              </>
                            )}
                            {penilaian.map((row) => (
                              <TableRow key={row.id}>
                                <TableCell
                                  style={{ minWidth: 100 }}
                                  align="left"
                                >
                                  <TextField
                                    id="namaPelajar"
                                    defaultValue={row.namaPelajar}
                                    variant="standard"
                                    onChange={(e) =>
                                      setBodyPenilaian({
                                        ...bodyPenilaian,
                                        namaPelajar: e.target.value,
                                      })
                                    }
                                    InputProps={{
                                      readOnly: row.id !== penilaianId,
                                    }}
                                  />
                                </TableCell>
                                <TableCell
                                  style={{ minWidth: 100 }}
                                  align="left"
                                >
                                  <TextField
                                    id="nilai"
                                    defaultValue={row.nilai}
                                    onChange={(e) =>
                                      setBodyPenilaian({
                                        ...bodyPenilaian,
                                        nilai: e.target.value,
                                      })
                                    }
                                    variant="standard"
                                    InputProps={{
                                      readOnly: row.id !== penilaianId,
                                    }}
                                  />
                                </TableCell>
                                <TableCell
                                  style={{ minWidth: 100 }}
                                  align="left"
                                >
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DatePicker
                                      label="Tanggal Penilaian"
                                      value={dayjs(
                                        new Date(row.tanggalPenilaian)
                                      )}
                                      onChange={(e) =>
                                        setBodyPenilaian({
                                          ...bodyPenilaian,
                                          tanggalPenilaian: e?.$d,
                                        })
                                      }
                                      readOnly={row.id !== penilaianId}
                                    />
                                  </LocalizationProvider>
                                </TableCell>
                                <TableCell
                                  style={{ minWidth: 100 }}
                                  align="left"
                                >
                                  {row.id === penilaianId ? (
                                    <>
                                      <IconButton>
                                        <FontAwesomeIcon
                                          icon={faFloppyDisk}
                                          className="text-cyan-500"
                                          onClick={handleSubmitPenilaian}
                                        />
                                      </IconButton>
                                    </>
                                  ) : (
                                    <>
                                      <IconButton
                                        onClick={() =>
                                          handleUpdatePenilaian(row)
                                        }
                                      >
                                        <FontAwesomeIcon
                                          icon={faPenToSquare}
                                          className="text-cyan-500"
                                        />
                                      </IconButton>
                                    </>
                                  )}
                                  <IconButton
                                    onClick={() => handleDeletePenilaian(row.id)}
                                  >
                                    <FontAwesomeIcon
                                      icon={faTrash}
                                      className="text-red-500"
                                    />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                          <TableFooter>
                            <TableRow style={{ width: "100%" }}>
                              <TableCell
                                colSpan={columnsPelajar.length}
                                style={{ width: "100%" }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    width: "100%",
                                    gap: 4,
                                  }}
                                >
                                  <Pagination
                                    count={Math.ceil(
                                      totalPenilaian / paramPenilaian.limit
                                    )}
                                    page={paramPenilaian.page}
                                    onChange={() =>
                                      handleChangePage(_e, value, "penilaian")
                                    }
                                  />
                                  <Select
                                    labelId="limit"
                                    id="limit"
                                    value={paramPenilaian.limit}
                                    label="Limit"
                                    onChange={() =>
                                      handleLimitChange(e, "penilaian")
                                    }
                                  >
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={20}>20</MenuItem>
                                    <MenuItem value={30}>30</MenuItem>
                                    <MenuItem value={40}>40</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                  </Select>
                                  <p className="text-base text-black">
                                    Total {totalPenilaian}
                                  </p>
                                </div>
                              </TableCell>
                            </TableRow>
                          </TableFooter>
                        </Table>
                      </TableContainer>
                    </Paper>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Select
                  value={jadwalPengajaran.hari}
                  onChange={(e) =>
                    setJadwalPengajaran({
                      ...jadwalPengajaran,
                      hari: e.target.value,
                    })
                  }
                  displayEmpty
                  className="w-2/5"
                >
                  <MenuItem value="">
                    <p className="text-gray-600">Pilih Hari</p>
                  </MenuItem>
                  {[
                    "Senin",
                    "Selasa",
                    "Rabu",
                    "Kamis",
                    "Jumat",
                    "Sabtu",
                    "Minggu",
                  ].map((day) => (
                    <MenuItem key={day} value={day}>
                      {day}
                    </MenuItem>
                  ))}
                </Select>
                <Autocomplete
                  id="mataPelajaran"
                  options={mataPelajaran}
                  getOptionLabel={(option) => option?.nama}
                  defaultValue={handleValueMapel(
                    jadwalPengajaran.mataPelajaran
                  )}
                  onChange={handleInputMapel}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Pilih Mata Pelajaran"
                      variant="standard"
                    />
                  )}
                  className="w-2/5"
                />
                <Autocomplete
                  id="pengajar"
                  options={pengajar}
                  getOptionLabel={(option) => option?.nama}
                  defaultValue={handleValuePengajar(pengajar?.nama)}
                  onChange={(_e, value) => {
                    setJadwalPengajaran({
                      ...jadwalPengajaran,
                      idPengajar: value?.id,
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Pilih Pengajar"
                      variant="standard"
                    />
                  )}
                  className="w-2/5"
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="Jam Mulai"
                    minTime={dayjs().set("hour", 7).startOf("hour")}
                    maxTime={dayjs().set("hour", 15).startOf("hour")}
                    onChange={(e) =>
                      setJadwalPengajaran({
                        ...jadwalPengajaran,
                        jamMulai: e?.$d,
                      })
                    }
                    className="w-2/5"
                  />
                  <TimePicker
                    label="Jam Selesai"
                    minTime={dayjs().set("hour", 7).startOf("hour")}
                    maxTime={dayjs().set("hour", 17).startOf("hour")}
                    onChange={(e) =>
                      setJadwalPengajaran({
                        ...jadwalPengajaran,
                        jamSelesai: e?.$d,
                      })
                    }
                    className="w-2/5"
                  />
                </LocalizationProvider>
                {warning ? (
                  <p className="text-red-500">
                    Jam Mulai tidak boleh lebih dari Jam Selesai!
                  </p>
                ) : (
                  <span></span>
                )}
                <LoadingButton
                  size="large"
                  endIcon={
                    isUpdate ? (
                      <FontAwesomeIcon icon={faPenToSquare} />
                    ) : (
                      <FontAwesomeIcon icon={faUserPlus} />
                    )
                  }
                  onClick={handleSubmit}
                  loading={loading}
                  disabled={warning}
                  loadingPosition="end"
                  variant="contained"
                  className="w-2/5"
                >
                  <span>
                    {isUpdate
                      ? "Update Jadwal Pengajaran"
                      : "Tambah Jadwal Pengajaran"}
                  </span>
                </LoadingButton>
              </>
            )}
          </Paper>
        </AppBar>
      </Dialog>
      <Snackbar
        open={openAlert}
        autoHideDuration={1000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={handleCloseNotif}
      >
        <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
          {notification}
        </Alert>
      </Snackbar>
    </>
  );
};
