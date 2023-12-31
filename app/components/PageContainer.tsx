import { useEffect, useState } from "react";

interface tab {
  value: string;
  display: string;
}

interface PageContainerProps {
  title: string;
  description: string;
  children: React.ReactNode;
  tabs?: Array<tab>;
  showImportButton?: boolean;
  onClickImport?: () => void;
  onChangeTab?: (tab: tab) => void;
}

export default function PageContainer({
  title,
  description,
  children,
  tabs,
  showImportButton = false,
  onClickImport,
  onChangeTab,
}: PageContainerProps) {
  const [selectedTab, setSelectedTab] = useState<tab>({
    value: "others",
    display: "Other VCs",
  });

  useEffect(() => {
    onChangeTab && onChangeTab(selectedTab);
  }, [selectedTab]);

  return (
    <div className="pl-64">
      <div className="w-full flex flex-col p-10 space-y-10">
        <div className="w-full flex flex-row justify-between items-center">
          {/* heading */}
          <div className="w-full flex flex-col space-y-1">
            <p className="text-2xl">{title}</p>
            <p className="text-theme-light-gray">{description}</p>
          </div>
          {showImportButton && (
            <button
              className="py-3 px-6 rounded-xl text-sm bg-theme-light-gray/20"
              onClick={() => onClickImport && onClickImport()}
            >
              <p className="whitespace-nowrap">Import VC</p>
            </button>
          )}
        </div>

        {tabs && tabs.length > 0 ? (
          <div className="w-full flex flex-col pt-[40px]">
            {/* tabs */}
            <div className="w-full h-[2px] -mb-[50px] bg-theme-medium-gray rounded-full"></div>
            <div className="w-full flex flex-row justify-start items-center space-x-5">
              {tabs &&
                tabs.map((tab, index) => (
                  <button
                    key={index}
                    className="py-3 space-y-3"
                    onClick={() => setSelectedTab(tab)}
                  >
                    <p className="px-5">{tab.display}</p>
                    {selectedTab.value === tab.value ? (
                      <div className="w-full h-[2px] bg-theme-white rounded-full"></div>
                    ) : (
                      <div className="w-full h-[2px] bg-theme-medium-gray rounded-full"></div>
                    )}
                  </button>
                ))}
            </div>
          </div>
        ) : (
          <div className="w-full h-[2px] -mb-[50px] bg-theme-medium-gray rounded-full"></div>
        )}
        {children}
      </div>
    </div>
  );
}
