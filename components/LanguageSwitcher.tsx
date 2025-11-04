
'use client';
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher(){
  const { i18n:inst } = useTranslation();
  return (
    <Select
      value={inst.language}
      onChange={(lng)=>inst.changeLanguage(lng)}
      options={[
        {value:'en',label:'EN'},
        {value:'fr',label:'FR'},
        {value:'ar',label:'AR'}
      ]}
      className="min-w-[4rem] text-xs font-medium uppercase [&_.ant-select-selector]:!bg-transparent
                 [&_.ant-select-selector]:!border-textPrimary/30
                 [&_.ant-select-arrow]:!text-textPrimary"
      styles={{ popup: { root: { fontSize: 12 } } }}
    />
  );
}
