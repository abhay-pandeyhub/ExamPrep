
document.addEventListener("DOMContentLoaded", () => {

  const papers = [
    {
      year: 2025,
      label: "26 June 2025 - Shift 1",
      paper: "https://cdn-images.prepp.in/public/image/Computer_Science_and_Applications_and_General_Paper_4f88d345720e56fea4354b6847ee1302.pdf",
      key: "https://cdn-images.prepp.in/public/image/UGC_NET_2025_Computer_Science_and_Applications_Answer_Key_Jun_26_Shift_1__bd97ef856d290f5f767313b7506512a5.pdf"
    },
    {
      year: 2024,
      label: "23 August 2024 - Shift 1",
      paper: "https://cdn-images.prepp.in/public/image/UGC_NET_2024_Computer_Science_and_Applications_Aug_23_2024_Shift_1__2e67ae47e651d2c75ecf7e18f458cb6b.pdf",
      key: "https://cdn-images.prepp.in/public/image/UGC_NET_2024_June_AK_Computer_Science_038daee4ee57c9bc35f86413963a504b.pdf"
    },
    {
      year: 2023,
      label: "17 June 2023 - Shift 1",
      paper: "https://cdn-images.prepp.in/public/image/UGC_NET_Paper_2_Computer_Science_Question_Paper_June_17_2023_Download_PDF_8109f0c71417056a130efd44b061b72d.pdf",
      key: "https://cdn-images.prepp.in/public/image/UGC_NET_2023_JUNE_ANSWER_KEY_COMP_SCIE_1_670b6b9f52d22339ea3f5a4bca0f5bb1.pdf"
    },
    {
      year: 2022,
      label: "8 October 2022 - Shift 1",
      paper: "https://cdn-images.prepp.in/public/image/ugc-net-2022-computer-science-and-applications-question-paper-pdf-oct-08-2022-shift-1-1778482485.pdf",
      key: "https://cdn-images.prepp.in/public/image/UGC_NET_2022_JUNE_ANSWER_KEY_PDF_COMPUTER_SCIENCE_AND_APPLICATIONS_1_7d619e1b4db5d47cc7597821947dc3c3.pdf"
    },
    {
      year: 2021,
      label: "26 November 2021 - Shift 2",
      paper: "https://cdn-images.prepp.in/public/image/Paper_20220303105042_41142f1d4f45c5379bd7b7ac9862e1bb.pdf",
      key: "https://cdn-images.prepp.in/public/image/1a387b298780f24c9a650a720786b385.pdf"
    },
    {
      year: 2020,
      label: "11 November 2020 - Shift 2",
      paper: "https://cdn-images.prepp.in/public/image/ugc-net-2020-computer-science-and-applications-question-paper-and-answer-key-pdf-nov-11-2020-shift-211zon-1778136661.pdf",
      key: "https://cdn-images.prepp.in/public/image/Computer_Science_and_Applications_c584d40a85c512749f0fb8e9b44fc63f.pdf"
    },
    {
      year: 2018,
      label: "8 July 2018 - Paper II",
      paper: "https://cdn-images.prepp.in/public/image/ugc_net_2018_Paper_II_Computer_Science_5c8003e4380be1589c278bd83a8e7c12.pdf",
      key: "https://cdn-images.prepp.in/public/image/ugc_net_2018_paper_2_computer_science_application_4a47aed949d05f710bc5bfa0f38e0c61.pdf"
    },
    {
      year: 2017,
      label: "5 November 2017 - Paper II",
      paper: "https://cdn-images.prepp.in/public/image/af4d40700bc06df59701fadb4ca48d40.pdf",
      key: "https://cdn-images.prepp.in/public/image/56b7e62b028243cfd82e7904443d20b5.pdf"
    },
    {
      year: 2016,
      label: "10 July 2016 - Paper II",
      paper: "https://cdn-images.prepp.in/public/image/J_87_16_II_Computer_Science_5d595c71ec9852f8346ac5e42857f7dd.pdf",
      key: "https://cdn-images.prepp.in/public/image/ugc_net_2016_computer_science_3_1fc5ce40ad639b6880e8ea9801d1265f.pdf"
    }
  ];

  const yearFilter = document.getElementById("yearFilter");
  const paperList = document.getElementById("paperList");

  if (!yearFilter || !paperList) return;

  const years = [...new Set(papers.map(p => p.year))];

  years.forEach(year => {
    const option = document.createElement("option");
    option.value = String(year);
    option.textContent = String(year);
    yearFilter.appendChild(option);
  });

  function renderPapers() {
    paperList.innerHTML = "";

    const selectedYear = yearFilter.value;

    const filtered = papers.filter(p =>
      selectedYear === "all" ||
      String(p.year) === selectedYear
    );

    filtered.forEach(p => {
      const card = document.createElement("article");
      card.className = "pyq-card";

      const title = document.createElement("h3");
      title.textContent = `UGC NET Computer Science - ${p.year}`;

      const session = document.createElement("p");
      session.textContent = p.label;

      const paperLink = document.createElement("a");
      paperLink.href = p.paper;
      paperLink.textContent = "📄 View Question Paper";
      paperLink.target = "_blank";
      paperLink.rel = "noopener noreferrer";

      const keyLink = document.createElement("a");
      keyLink.href = p.key;
      keyLink.textContent = "🔑 View Answer Key";
      keyLink.target = "_blank";
      keyLink.rel = "noopener noreferrer";

      card.append(title, session, paperLink, keyLink);
      paperList.appendChild(card);
    });
  }

  yearFilter.addEventListener("change", renderPapers);
  renderPapers();

});
