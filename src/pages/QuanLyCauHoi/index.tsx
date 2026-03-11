import React from "react";
import { Tabs, Card } from "antd";

import KnowledgeCategory from "./components/KnowledgeCategory";
import SubjectManager from "./components/SubjectManager";
import QuestionManager from "./components/QuestionManager";
import ExamGenerator from "./components/ExamGenerator";

const { TabPane } = Tabs;

export default function QuanLyCauHoi() {
  return (
    <Card>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Khối kiến thức" key="1">
          <KnowledgeCategory />
        </TabPane>

        <TabPane tab="Môn học" key="2">
          <SubjectManager />
        </TabPane>

        <TabPane tab="Câu hỏi" key="3">
          <QuestionManager />
        </TabPane>

        <TabPane tab="Tạo đề thi" key="4">
          <ExamGenerator />
        </TabPane>
      </Tabs>
    </Card>
  );
}