import React from "react";
import SideBar from "./Sidebar";
import axios from "axios";
import { ProfilePicReusable } from "../extras/ProfilePic";
import { Link } from "react-router-dom";
const Reports = props => {
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    const initializeState = async () => {
      const response = await axios.get(`/api/admin/getReports`);
      setData(response.data);
    };
    initializeState();
  }, []);
  console.log(data);
  return (
    <div className="row">
      <SideBar />
      {data !== null && (
        <div className="col-9 mb-0" style={{ background: "#ededed" }}>
          <h2 className="text-center mt-2">Reports</h2>
          <h5 className="text-left">{data.totalReports} Total Reports</h5>
          <ReportList reports={data.reports} />
        </div>
      )}
    </div>
  );
};
const ReportList = ({ reports }) => {
  return Object.keys(reports).map(paperId => {
    return Object.keys(reports[paperId]).map(questionNum => {
      if (questionNum !== "title") {
        return (
          <ReportCard
            reports={reports[paperId][questionNum]}
            paperTitle={reports[paperId].title}
            paperId={paperId}
            questionNum={questionNum}
            key={paperId + questionNum}
          />
        );
      } else {
        return null;
      }
    });
  });
};
const ReportCard = ({ reports, paperTitle, paperId, questionNum }) => {
  return (
    <div className="col-lg-8 col-11 mx-auto card p-3 mb-2">
      <h5>
        {reports.length} Report(s) on question number {questionNum} of{" "}
        {paperTitle}
      </h5>
      <div>
        By{" "}
        {reports.slice(0, 2).map(report => {
          return (
            <ProfilePicReusable
              user={report.reporter}
              size={14}
              key={report.reporter.id}
            />
          );
        })}
        {reports.length > 1 && (
          <React.Fragment> and {reports.length - 1} more</React.Fragment>
        )}
      </div>
      <div className="mt-2">
        <Link
          className="btn btn-sm btn-success"
          to={`/admin/resolve/${paperId}/${questionNum}`}
        >
          Resolve
        </Link>
      </div>
    </div>
  );
};

export default Reports;
