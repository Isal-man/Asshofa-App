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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faPenToSquare,
  faTrash,
  faXmark,
  faUserPlus,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const WaliSantriPage = () => {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState();
  const [notification, setNotification] = useState("");
  const [waliSantriId, setWaliSantriId] = useState("");
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [walisantri, setWaliSantri] = useState({
    nama: "",
    alamat: "",
    telepon: ""
  });
  const [param, setParam] = useState({
    nama: "",
    alamat: "",
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
      id: "alamat",
      label: "Alamat",
      minWidth: 250,
      filter: (
        <TextField
          id="outlined-basic"
          label="Alamat"
          variant="outlined"
          className="w-full"
          onBlur={(e) => handleAlamat(e)}
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
  }, []);

  const load = async (props) => {
    const { nama, telepon, alamat, page, limit } = props;

    const request = await api.get(
      APP_BACKEND +
        `/wali-santri/get-list-wali-santri?nama=${nama}&telepon=${telepon}&alamat=${alamat}&page=${page}&limit=${limit}`
    );
    const response = await request.data;
    const data = response?.data?.list;
    const count = response?.data?.total;
    setRows(data);
    setTotal(count);
  };

  const handleNama = (e) => {
    const nama = e.target.value;
    setRows([]);
    load({ ...param, page: 1, nama });
    setParam({ ...param, page: 1, nama });
  };

  const handleAlamat = (e) => {
    const alamat = e.target.value;
    setRows([]);
    load({ ...param, page: 1, alamat });
    setParam({ ...param, page: 1, alamat });
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
    load({ ...param, page: 1, limit: e.target.value });
    setParam({ ...param, page: 1, limit: e.target.value });
  };

  const handleUpdate = (data) => {
    setIsUpdate(true);
    setOpen(true);
    setWaliSantri(data);
    setWaliSantriId(data?.id);
  };

  const handleDelete = async (idWaliSantri) => {
    const request = await api.delete(
      APP_BACKEND + `/wali-santri/delete?id=${idWaliSantri}`
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
    setWaliSantri({
      nama: "",
      alamat: "",
      telepon: ""
    })
  };

  const handleCloseNotif = () => {
    setOpenAlert(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const method = isUpdate
      ? api.put(`/wali-santri/update?id=${waliSantriId}`, walisantri)
      : api.post(APP_BACKEND + "/wali-santri/create", walisantri);

    const request = await method;

    const response = await request?.data?.detail;

    setLoading(false);
    setOpen(false);
    setNotification(response);
    setRows([]);
    load({ ...param });
    setIsUpdate(false)
    setOpenAlert(true);
    setWaliSantri({
      nama: "",
      alamat: "",
      telepon: ""
    })
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen w-screen bg-gray-200">
        <MiniDrawer />
        <div className="flex flex-col mt-14 mr-4 h-5/6 w-full p-4 bg-gray-50 rounded-md">
          <div className="flex justify-between w-full p-2">
            <p className="font-bold text-3xl">Data Wali Santri</p>
            <Button
              variant="contained"
              className="h-10 w-90"
              startIcon={<FontAwesomeIcon icon={faCirclePlus} />}
              onClick={handleClickOpen}
            >
              Tambah Data Wali Santri
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
                          {row.alamat}
                        </TableCell>
                        <TableCell style={{ minWidth: 250 }} align="left">
                          {row.telepon}
                        </TableCell>
                        <TableCell style={{ minWidth: 250 }} align="left">
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
              {isUpdate ? "Form Update Wali Santri" : "Form Tambah Wali Santri"}
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
              value={walisantri.nama}
              onChange={(e) => setWaliSantri({ ...walisantri, nama: e.target.value })}
            />
            <TextField
              id="outlined-basic"
              label="Alamat"
              variant="outlined"
              className="w-2/5"
              value={walisantri.alamat}
              onChange={(e) => setWaliSantri({ ...walisantri, alamat: e.target.value })}
            />
            <TextField
              id="outlined-basic"
              label="Telepon"
              variant="outlined"
              className="w-2/5"
              value={walisantri.telepon}
              onChange={(e) => setWaliSantri({ ...walisantri, telepon: e.target.value })}
            />
            <LoadingButton
              size="large"
              endIcon={isUpdate ? (<FontAwesomeIcon
                    icon={faPenToSquare}
                  />
                ) : (
                  <FontAwesomeIcon icon={faUserPlus} />
                )}
              onClick={handleSubmit}
              loading={loading}
              loadingPosition="end"
              variant="contained"
              className="w-2/5"
            >
              <span>{isUpdate ? "Update Wali Santri" : "Tambah Wali Santri"}</span>
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
