import { useEffect, forwardRef } from "react";
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
import {
  faCirclePlus,
  faPenToSquare,
  faTrash,
  faXmark,
  faUserPlus,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const PengajarPage = () => {
  const [rows, setRows] = useState([]);
  const [spesialisasi, setSpesialisasi] = useState([]);
  const [total, setTotal] = useState();
  const [notification, setNotification] = useState("");
  const [pengajarId, setPengajarId] = useState("");
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pengajar, setPengajar] = useState({
    nama: "",
    spesialisasi: "",
    telepon: "",
  });
  const [param, setParam] = useState({
    nama: "",
    spesialisasi: "",
    telepon: "",
    page: 1,
    limit: 10,
  });

  const columns = [
    {
      id: "nama",
      label: "Nama",
      minWidth: 250,
      filter: (
        <TextField
          id="outlined-basic"
          label="Nama"
          variant="outlined"
          className="w-full"
          onBlur={(e) => handleNama(e)}
        />
      ),
    },
    {
      id: "spesialisasi",
      label: "Spesialisasi",
      minWidth: 250,
      filter: (
        <TextField
          id="outlined-basic"
          label="Spesialisasi"
          variant="outlined"
          className="w-full"
          onBlur={(e) => handleSpesialisasi(e)}
        />
      ),
    },
    {
      id: "telepon",
      label: "Telepon",
      minWidth: 250,
      filter: (
        <TextField
          id="outlined-basic"
          label="Telepon"
          variant="outlined"
          className="w-full"
          onBlur={(e) => handleTelepon(e)}
        />
      ),
    },
    {
      id: "action",
      label: "Action",
      minWidth: 250,
    },
  ];

  useEffect(() => {
    load({ ...param });
    loadSpesialisasi();
  }, []);

  const load = async (props) => {
    const { nama, telepon, spesialisasi, page, limit } = props;

    const request = await api.get(
      APP_BACKEND +
        `/pengajar/get-list-pengajar?nama=${nama}&telepon=${telepon}&spesialisasi=${spesialisasi}&page=${page}&limit=${limit}`
    );
    const response = await request.data;
    const data = response?.data?.list;
    const count = response?.data?.total;
    setRows(data);
    setTotal(count);
  };

  const loadSpesialisasi = async () => {
    const request = await api.get(
      APP_BACKEND + "/spesialisasi/get-list-spesialisasi"
    );
    const response = await request.data;
    const data = response?.data;
    setSpesialisasi(data);
  };

  const handleNama = (e) => {
    const nama = e.target.value;
    setRows([]);
    load({ ...param, page: 1, nama });
    setParam({ ...param, page: 1, nama });
  };

  const handleSpesialisasi = (e) => {
    setRows([]);
    load({ ...param, page: 1, spesialisasi: e.target.value });
    setParam({ ...param, page: 1, spesialisasi: e.target.value });
  };

  const handleTelepon = (e) => {
    const telepon = e.target.value;
    setRows([]);
    load({ ...param, page: 1, telepon });
    setParam({ ...param, page: 1, telepon });
  };

  const handleChangePage = (_e, value) => {
    setRows([]);
    load({ ...param, page: value });
    setParam({ ...param, page: value });
  };

  const handleLimitChange = (e) => {
    setRows([]);
    load({ ...param, limit: e.target.value });
    setParam({ ...param, limit: e.target.value });
  };

  const handleUpdate = (data) => {
    setIsUpdate(true);
    setOpen(true);
    setPengajar(data);
    setPengajarId(data?.id);
  };

  const handleDelete = async (idPengajar) => {
    const request = await api.delete(
      APP_BACKEND + `/pengajar/delete?id=${idPengajar}`
    );
    const response = await request?.data?.detail;
    setNotification(response);
    setRows([]);
    load({ ...param });
    setOpenAlert(true);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsUpdate(false);
    setPengajar({
      nama: "",
      spesialisasi: "",
      telepon: "",
    })
  };

  const handleCloseNotif = () => {
    setOpenAlert(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const method = isUpdate
      ? api.put(`/pengajar/update?id=${pengajarId}`, pengajar)
      : api.post(APP_BACKEND + "/pengajar/create", pengajar);

    const request = await method;

    const response = await request?.data?.detail;

    setLoading(false);
    setOpen(false);
    setNotification(response);
    setRows([]);
    load({ ...param });
    setOpenAlert(true);
    setPengajar({
      nama: "",
      spesialisasi: "",
      telepon: "",
    })
  };

  const handleValue = (param) => {
    let i = 0
    spesialisasi.map((e, idx) => {
      if (e?.spesialisasi == param) i = idx
    })
    return param !== "" ? spesialisasi[i] : null
  }

  return (
    <>
      <div className="flex justify-center items-center h-screen w-screen bg-gray-200">
        <MiniDrawer />
        <div className="flex flex-col mt-14 mr-4 h-5/6 w-full p-4 bg-gray-50 rounded-md">
          <div className="flex justify-between w-full p-2">
            <p className="font-bold text-3xl">Data Pengajar</p>
            <Button
              variant="contained"
              className="h-10 w-60"
              startIcon={<FontAwesomeIcon icon={faCirclePlus} />}
              onClick={handleClickOpen}
            >
              Tambah Data Pengajar
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
                        <TableCell style={{ minWidth: 250 }} align="left">
                          {row.nama}
                        </TableCell>
                        <TableCell style={{ minWidth: 250 }} align="left">
                          {row.spesialisasi}
                        </TableCell>
                        <TableCell style={{ minWidth: 250 }} align="left">
                          {row.telepon}
                        </TableCell>
                        <TableCell style={{ minWidth: 250 }} align="left">
                          <IconButton onClick={() => handleUpdate(row)}>
                            <FontAwesomeIcon
                              icon={faPenToSquare}
                              className="text-blue-500"
                            />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(row.id)}>
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
                            onChange={handleChangePage}
                          />
                          <Select
                            labelId="limit"
                            id="limit"
                            value={param.limit}
                            label="Limit"
                            onChange={handleLimitChange}
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
              {isUpdate ? "Form Update Pengajar" : "Form Tambah Pengajar"}
            </Typography>
          </Toolbar>
          <Paper
            className="flex flex-col items-center gap-4 p-2 h-full"
            elevation={3}
          >
            <FontAwesomeIcon icon={faUser} className="size-1/4 p-4" />
            <TextField
              id="outlined-basic"
              label="Nama"
              variant="outlined"
              className="w-2/5"
              value={pengajar.nama}
              onChange={(e) =>
                setPengajar({ ...pengajar, nama: e.target.value })
              }
            />
            <TextField
              id="outlined-basic"
              label="Telepon"
              variant="outlined"
              className="w-2/5"
              value={pengajar.telepon}
              onChange={(e) =>
                setPengajar({ ...pengajar, telepon: e.target.value })
              }
            />
            <Autocomplete
              id="spesialisasi"
              options={spesialisasi}
              getOptionLabel={(option) => option?.spesialisasi}
              defaultValue={handleValue(pengajar.spesialisasi)}
              onChange={(_e, value) => {
                setPengajar({ ...pengajar, spesialisasi: value?.spesialisasi });
              }}
              renderInput={(params) => (
                <TextField {...params} label="Pilih Spesialisasi" variant="standard" />
              )}
              className="w-2/5"
            />
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
              loadingPosition="end"
              variant="contained"
              className="w-2/5"
            >
              <span>{isUpdate ? "Update Pengajar" : "Tambah Pengajar"}</span>
            </LoadingButton>
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
