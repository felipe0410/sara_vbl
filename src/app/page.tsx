'use client'
import { Box, Button, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";

export default function Home() {
  const [activeSection, setActiveSection] = useState("HOME")
  const sections = ["HOME", "SKILLS", "PORTAFOLIO"]
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const contact = [
    {
      name: 'Email',
      value: "saravbl93@gmail.com",
      link: "mailto:saravbl93@gmail.com"
    },
    {
      name: 'Behance',
      value: "behance.net/svalentinee",
      link: "https://www.behance.net/saravabalague"
    },
    {
      name: '',
      value: "",
      link: "https://www.behance.net/saravabalague"
    },
  ]
  const buttons = [
    {
      text: "DOWNLAND CV",
      link: "https://drive.google.com/file/d/1cP3njuaGDAbtrV85rU-zZNy__GrtVsaw/view?usp=sharing"
    },
    {
      text: "LINKED IN",
      link: "https://www.linkedin.com/in/sara-balaguera/"
    },
    {
      text: "HIRE ME NOW",
      link: "mailto:saravbl93@gmail.com"
    }
  ]
  const projects = ["/projetcs/INTER.svg", "/projetcs/GO.svg", "/projetcs/felipe.svg", "/projetcs/whitesofth.png", "/projetcs/chano.png"]
  const projectsResponsive = ["/projetcs/INTER.svg", "/projetcs/GO.svg", "/projetcs/felipe.svg", "/projetcs/responsivewhitesofth.svg", "/projetcs/responsiveChano.svg"]

  const header = (opacity: any) => (
    <Box id='header' sx={{ display: 'flex', justifyContent: "space-between" }}>
      <Box sx={{ height: { xs: "30px", sm: '80px' } }}>
        <Box sx={{ height: '100%' }} component={'img'} src="/logo.png" />
      </Box>
      <Box sx={{ display: 'flex' }}>
        {sections.map((section, i) => (
          <Box
            sx={{
              alignSelf: 'center',
              padding: '5px 10px',
              background: activeSection === section ? "#A17695" : "transparent",
              borderRadius: activeSection === section ? "40px" : "0",
              boxShadow: activeSection === section ? "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" : "auto",
              marginX: { xs: '10px', sm: '30px' },
              color: activeSection === section ? "#fff" : "#000",
              fontFamily: "ClementePDai",
              fontSize: { xs: '13px', sm: "32px" },
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
            }} key={i * 99}>
            {section}
          </Box>
        ))}
      </Box>
      <Box sx={{ opacity: opacity }}>
        <Box component={'img'} src="/eeuu.png" />
      </Box>
    </Box>
  )

  const buttonsContact = (
    <Box
      sx={{
        margin: '0 auto',
        display: 'flex',
        width: "95%",
        justifyContent: "space-evenly"
      }}
    >
      {buttons.map((button, index) => {
        return (
          <Button
            href={button.link}
            key={index * 96}
            sx={{
              width: { xs: 'auto', sm: '20%' },
              fontSize: { xs: '10px', sm: "24px" },
            }}
            style={{
              color: "#000",
              fontFamily: "ClementePDai",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
              borderRadius: "40px",
              background: "#FFBCEC9E",
              boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            }}>
            {button.text}
          </Button>
        )
      })}
    </Box>
  )

  const experience = (
    <Typography
      align="center"
      sx={{
        margin: '0 auto',
        maxWidth: '570px',
        color: "#A17695",
        fontFamily: "ClementePDai",
        fontSize: { xs: '14px', sm: "28px" },
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "normal",
      }}>
      Let's craft memorable digital experiences together.
    </Typography>
  )

  return (
    <Box style={{ backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }} sx={{ background: { xs: 'url("/responsive.png")', sm: 'url("/background.png")' }, padding: { xs: '15px', sm: '50px' } }}>
      <>
        {header(1)}
      </>
      <Box
        sx={{
          display: 'flex',
          textAlign: 'center',
        }}>
        <Box sx={{
          marginTop: { xs: '20px', sm: 'auto' },
          width: '80%',
          marginRight: "-10%",
          zIndex: 1,
        }}>
          <Box>
            <Typography
              sx={{
                color: "#000",
                fontFamily: "ClementePDai",
                fontSize: { xs: '19px', sm: "64px" },
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal"
              }}
            >
              ¡Hello!  Im
              <span
                style={{
                  color: '#A17695',
                  WebkitTextStrokeColor: '#FFF',
                  WebkitTextStrokeWidth: '1px'
                }}
              >
                Sara Balaguera
              </span>
            </Typography>
            <Typography sx={{
              color: "#6F77A0",
              fontFamily: "ClementePDal",
              fontSize: { xs: '24px', sm: "64px" },
              fontStyle: "italic",
              fontWeight: 600,
              lineHeight: "normal",
              WebkitTextStrokeColor: '#FFF',
              WebkitTextStrokeWidth: '1px',
            }}>
              UX/UI Developer
            </Typography>
          </Box>
          <Box
            sx={{
              maxWidth: { xs: '100%', sm: '470px' },
              margin: "10px auto",
            }}
          >
            <Typography
              sx={{
                color: "#000",
                textAlign: "justify",
                fontFamily: "ClementePDag",
                fontSize: { xs: '11px', sm: "20px" },
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
              }}>
              I'm a UX/UI developer and designer with two years of experience. My expertise lies in creating user-centric, visually appealing interfaces. I excel in wireframing, prototyping, branding, and digital designs. My work combines aesthetics with functionality, exceeding user expectations.
            </Typography>
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'block', marginBottom: '40px' } }}>
            {experience}
          </Box>
        </Box>
        <Box sx={{ position: { sm: 'relative', xs: "relative" }, right: { xs: "-34px", sm: 'auto' } }}>
          <Box sx={{ maxWidth: { xs: '275px', sm: '100%' }, height: { xs: '85%', sm: 'auto' } }} component={'img'} src={matches ? "/img1.png" : "/responsive1.png"} />
        </Box>
      </Box>
      <Box sx={{ marginTop: '-10px' }}>
        <Box
          sx={{
            display: 'flex',
            margin: '0 auto',
            width: { xs: '95%', sm: "68%" },
            justifyContent: "space-between"
          }}
        >
          <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
            {experience}
          </Box>
          <Box sx={{ display: { sm: 'flex' }, justifyContent: "space-between" }}>
            {contact.map((contac, index) => {
              return (
                <Box sx={{ marginLeft: { sm: index === 1 ? '25%' : '0' } }} key={index * 98}>
                  <Typography
                    sx={{
                      color: "#A17695",
                      fontFamily: "ClementePDai",
                      fontSize: { xs: '10px', sm: "24px" },
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "normal",
                    }}
                  >
                    {contac.name}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#000",
                      fontFamily: "ClementePDai",
                      fontSize: { xs: '10px', sm: "24px" },
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "normal",
                    }}
                  >
                    {contac.value}
                  </Typography>
                </Box>
              )
            })}
          </Box>
        </Box>
        <>
          {buttonsContact}
        </>
      </Box>
      <Box>
        <Box sx={{ width: { xs: '40%', sm: '60%' }, maxWidth: '400px', margin: '0 auto', marginY: { xs: '40px', sm: '80px' } }} component={'img'} src="/skills.png" />
      </Box>
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        {header(0)}
      </Box>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{
          width: '40%',
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}>
          <Box
            sx={{
              width: { xs: '70%', sm: '100%' },
              position: { xs: 'absolute', sm: 'relative' },
              left: '-100px'
            }}
            component={'img'}
            src={matches ? "/img2.png" : "/responsive2.png"}
          />
        </Box>
        <Box sx={{ width: '60%', zIndex: 1 }}>
          <Typography
            sx={{
              color: "#6F77A0",
              textAlign: "center",
              fontFamily: "ClementePDap",
              fontSize: { xs: '20px', sm: "64px" },
              fontStyle: "italic",
              fontWeight: 900,
              lineHeight: "normal",
              WebkitTextStrokeColor: '#FFF',
              WebkitTextStrokeWidth: '1px'
            }}
          >
            Need creative design? I can Help you
          </Typography>
          <Typography
            sx={{
              marginTop: '20px',
              color: "#000",
              textAlign: "justify",
              fontFamily: "ClementePDag",
              fontSize: { xs: '11px', sm: "24px" },
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
            }}
          >
            I am a passionate designer with over three years of experience, focused on creating exceptional digital experiences. I am well versed in major design tools, allowing me to effectively translate my designs into captivating and functional web interfaces, interactive and dynamic applications that are not only visually appealing but also provide a smooth and engaging user experience. I am dedicated to designing user-centered solutions that not only meet business objectives but also surprise and delight end users.
          </Typography>
          <Typography
            align="center"
            sx={{
              textAlignLast: 'center',
              margin: '10px auto',
              color: "#6F77A0",
              textAlign: "justify",
              fontFamily: "ClementePDai",
              fontSize: { xs: '25px', sm: "64px" },
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
              WebkitTextStrokeColor: '#FFF',
              WebkitTextStrokeWidth: '1px'
            }}>
            Skills
          </Typography>
          <Box >
            <Box sx={{ margin: '0 auto', marginY: '10px', height: { xs: '34px', sm: 'auto' } }} component={'img'} src="/skills.png" />
          </Box>
          <Box sx={{ maxWidth: { xs: '230px', sm: '400px' }, margin: '0 auto', display: { xs: 'none', sm: 'block' } }}>
            <Box sx={{ margin: '0 auto' }} component={'img'} src="/skills/skill.png" />
          </Box>
        </Box>
      </Box>
      <Box sx={{ maxWidth: '230px', margin: '0 auto', display: { sm: 'none' } }}>
        <Box sx={{ margin: '0 auto' }} component={'img'} src="/skills/skill.png" />
      </Box>
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        {header(0)}
      </Box>
      <Box sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: 'space-evenly'
      }}>
        {(matches ? projects : projectsResponsive).map((projet, index) => (
          <Box sx={{ margin: '20px' }} key={index * 90}>
            <Box component={'img'} src={projet} />
          </Box>
        ))}
      </Box>
      <>
        {buttonsContact}
      </>
    </Box >
  );
}
