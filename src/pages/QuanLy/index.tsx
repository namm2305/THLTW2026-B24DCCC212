import { Tabs } from 'antd';
import { useState, useEffect } from 'react';

import SoVanBang from './components/SoVanBang';
import QuyetDinh from './components/QuyetDinh';
import CauHinhField from './components/CauHinhField';
import VanBangForm from './components/VanBangForm';
import TraCuu from './components/TraCuu';

export default function VanBangPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [decisions, setDecisions] = useState<any[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);

  // lưu localStorage
  useEffect(() => {
    const data = localStorage.getItem('vanbang');
    if (data) {
      const parsed = JSON.parse(data);
      setBooks(parsed.books || []);
      setDecisions(parsed.decisions || []);
      setFields(parsed.fields || []);
      setCertificates(parsed.certificates || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'vanbang',
      JSON.stringify({ books, decisions, fields, certificates })
    );
  }, [books, decisions, fields, certificates]);

  return (
    <Tabs>
      <Tabs.TabPane key='1' tab='Sổ văn bằng'>
        <SoVanBang books={books} setBooks={setBooks} />
      </Tabs.TabPane>
      <Tabs.TabPane key='2' tab='Quyết định'>
        <QuyetDinh
          decisions={decisions}
          setDecisions={setDecisions}
          books={books}
        />
      </Tabs.TabPane>
      <Tabs.TabPane key='3' tab='Cấu hình'>
        <CauHinhField fields={fields} setFields={setFields} />
      </Tabs.TabPane>
      <Tabs.TabPane key='4' tab='Văn bằng'>
        <VanBangForm
          certificates={certificates}
          setCertificates={setCertificates}
          books={books}
          decisions={decisions}
          fields={fields}
        />
      </Tabs.TabPane>
      <Tabs.TabPane key='5' tab='Tra cứu'>
        <TraCuu
          data={certificates}
          decisions={decisions}
          setDecisions={setDecisions}
        />
      </Tabs.TabPane>
    </Tabs>
  );
}