import React, { useEffect } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import styles from "../../styles/Teacher/TeacherLanding.module.css";
import { indigo } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import StudentImage from "../../assets/images/Buttons/Student.jpg";
import ITPImage from "../../assets/images/Buttons/ITP.jpg";
import PRISMImage from "../../assets/images/Buttons/PRISM.jpg";
import ITPSummaryImage from "../../assets/images/Buttons/ITPSummary.jpg";
import PRISMSummaryImage from "../../assets/images/Buttons/PRISMSummary.jpg";
import useAdminAuthCheck from "../../utils/useAdminAuthCheck";

const images = [
  {
    url: ITPImage,
    title: "Internship Information",
    width: "19%",
    link: "/teacher/itp",
  },
  {
    url: ITPSummaryImage,
    title: "Internship Summary",
    width: "19%",
    link: "/teacher/itpsummary",
  },
  {
    url: StudentImage,
    title: "Student Information",
    width: "19%",
    link: "/teacher/viewallstudents",
  },
  {
    url: PRISMSummaryImage,
    title: "PRISM Summary",
    width: "19%",
    link: "/teacher/prismsummary",
  },
  {
    url: PRISMImage,
    title: "PRISM Information",
    width: "19%",
    link: "/teacher/prism",
  },
];
const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: "relative",
  height: 250,

  [theme.breakpoints.down("sm")]: {
    height: 200,
  },
  "&:hover, &.Mui-focusVisible": {
    zIndex: 1,
    "& .MuiImageBackdrop-root": {
      opacity: 0.15,
    },
    "& .MuiImageMarked-root": {
      opacity: 0,
    },
    "& .MuiTypography-root": {
      border: "4px solid currentColor",
    },
  },
}));

const ImageSrc = styled("span")({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: "cover",
  backgroundPosition: "center 40%",
});

const Image = styled("span")(({ theme }) => ({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.common.white,
}));

const ImageBackdrop = styled("span")(({ theme }) => ({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: theme.palette.common.black,
  opacity: 0.4,
  transition: theme.transitions.create("opacity"),
}));

const ImageMarked = styled("span")(({ theme }) => ({
  height: 3,
  width: 18,
  backgroundColor: theme.palette.common.white,
  position: "absolute",
  bottom: -2,
  left: "calc(50% - 9px)",
  transition: theme.transitions.create("opacity"),
}));
const TeacherLanding = () => {
  useAdminAuthCheck(true);
  return (
    <div className={styles.teacherContainer}>
      <h2>Welcome to ITP/PRISM Interest Mapping Website</h2>

      <Box className={styles["Box"]}>
        {images.map((image) => (
          <ImageButton
            component={Link}
            to={image.link}
            focusRipple
            key={image.title}
            style={{
              width: image.width,
            }}
          >
            <ImageSrc style={{ backgroundImage: `url(${image.url})` }} />
            <ImageBackdrop className="MuiImageBackdrop-root" />
            <Image>
              <Typography
                component="span"
                variant="subtitle1"
                color="inherit"
                sx={{
                  position: "relative",
                  p: 4,
                  pt: 2,
                  pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                }}
              >
                {image.title}
                <ImageMarked className="MuiImageMarked-root" />
              </Typography>
            </Image>
          </ImageButton>
        ))}
      </Box>
    </div>
  );
};

export default TeacherLanding;
