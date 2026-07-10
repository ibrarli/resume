import React from "react";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import { CommandAutocomplete } from "../../global/CommandAutocomplete";
import { Dropdown } from "../../global/Dropdown";
import { CITIES_DATA } from "../../../src/data/cities";
import { SOCIAL_PLATFORMS } from "../../../src/data/social";
import type { ResumeData } from "../../../types";

interface ProfileEssentialsProps {
  data: ResumeData;
  onUpdatePersonalInfo: (field: string, value: any) => void;
  onAddSocialLink: () => void;
  onRemoveSocialLink: (id: string) => void;
}

export const ProfileEssentials: React.FC<ProfileEssentialsProps> = ({
  data,
  onUpdatePersonalInfo,
  onAddSocialLink,
  onRemoveSocialLink,
}) => {
  const formatWordCapitalization = (val: string) => {
    return val.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
  };

  const handleWebsiteBlur = () => {
    let url = data.personalInfo.website.trim();
    if (url && !/^https?:\/\//i.test(url)) {
      onUpdatePersonalInfo("website", `https://${url}`);
    }
  };

  const emailDomains = [
    "@gmail.com",
    "@outlook.com",
    "@yahoo.com",
    "@hotmail.com",
    "@live.com",
  ];

  const handleUrlChange = (idx: number, inputVal: string, currentPlatform: string) => {
    const updated = [...data.personalInfo.links];
    const matchConfig = SOCIAL_PLATFORMS.find(p => p.value === currentPlatform);

    if (matchConfig) {
      if (!inputVal.startsWith(matchConfig.prefix)) {
        updated[idx].url = matchConfig.prefix;
      } else {
        updated[idx].url = inputVal;
      }
    } else {
      updated[idx].url = inputVal;
    }

    onUpdatePersonalInfo("links", updated);
  };

  return (
    <div className="bg-background p-5 rounded-2xl border-2 border-foreground/10 space-y-4">
      <h3 className="text-xs font-bold tracking-wide text-foreground font-heading uppercase">
        Profile Essentials
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-body">
        <input
          type="text"
          placeholder="Full Name"
          value={data.personalInfo.fullName}
          onChange={(e) =>
            onUpdatePersonalInfo(
              "fullName",
              formatWordCapitalization(e.target.value),
            )
          }
          className="w-full h-10 bg-background border-2 border-foreground/10 rounded-xl px-3 text-xs text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
        />
        <input
          type="text"
          placeholder="Target Job Title"
          value={data.personalInfo.title}
          onChange={(e) =>
            onUpdatePersonalInfo(
              "title",
              formatWordCapitalization(e.target.value),
            )
          }
          className="w-full h-10 bg-background border-2 border-foreground/10 rounded-xl px-3 text-xs text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
        />

        <CommandAutocomplete
          value={data.personalInfo.email}
          onChange={(val) => onUpdatePersonalInfo("email", val)}
          onBlur={(e) => {
            const val = e.target.value.trim();
            if (val.endsWith("@")) {
              onUpdatePersonalInfo("email", val + "gmail.com");
            }
          }}
          placeholder="Email Address"
          type="email"
          suggestions={emailDomains}
          className="w-full h-10 bg-background border-2 border-foreground/10 rounded-xl px-3 text-xs text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={data.personalInfo.phone}
          onChange={(e) => {
            const sanitized = e.target.value.replace(/[^0-9+\s-]/g, "");
            onUpdatePersonalInfo("phone", sanitized);
          }}
          className="w-full h-10 bg-background border-2 border-foreground/10 rounded-xl px-3 text-xs text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
        />

        {/* Location Dropdown supporting native unselect states */}
        <Dropdown
          value={data.personalInfo.location}
          placeholder="Select Location"
          options={CITIES_DATA}
          onChange={(val) => onUpdatePersonalInfo("location", val)}
          className="h-10"
        />

        <input
          type="text"
          placeholder="Website Link"
          value={data.personalInfo.website}
          onChange={(e) => onUpdatePersonalInfo("website", e.target.value)}
          onBlur={handleWebsiteBlur}
          className="w-full h-10 bg-background border-2 border-foreground/10 rounded-xl px-3 text-xs text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <div className="space-y-3 pt-3 border-t-2 border-foreground/10 font-body">
        <div className="flex justify-between items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground/50">
              Professional Links
            </span>
            
            {/* Premium, Minimalist Optimization Advisory Label */}
            {data.personalInfo.links.length > 3 && (
              <div className="flex items-center gap-1 text-[10px] font-medium text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded-full border border-amber-500/10 animate-fade-in">
                <AlertCircle size={10} />
                <span>Max 3 links highly recommended for formatting layout</span>
              </div>
            )}
          </div>
          
          <button
            type="button"
            onClick={onAddSocialLink}
            className="text-primary hover:opacity-80 flex items-center gap-1 text-xs font-bold cursor-pointer transition-opacity"
          >
            <Plus size={14} /> Add Handle
          </button>
        </div>

        {data.personalInfo.links.map((link, idx) => (
          <div key={link.id} className="flex gap-2 items-center">
            <div className="w-1/3 shrink-0">
              <Dropdown
                value={link.platform}
                placeholder="Platform"
                options={SOCIAL_PLATFORMS}
                onChange={(val) => {
                  const updated = [...data.personalInfo.links];
                  updated[idx].platform = val;

                  const matchConfig = SOCIAL_PLATFORMS.find((p) => p.value === val);
                  if (matchConfig) {
                    updated[idx].url = matchConfig.prefix;
                  }

                  onUpdatePersonalInfo("links", updated);
                }}
                className="h-9"
              />
            </div>

            <input
              type="text"
              placeholder="Profile URL"
              value={link.url}
              onChange={(e) => handleUrlChange(idx, e.target.value, link.platform)}
              className="w-2/3 h-9 bg-background border-2 border-foreground/10 rounded-xl px-3 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
            />

            <button
              type="button"
              onClick={() => onRemoveSocialLink(link.id)}
              className="text-foreground/40 hover:text-red-500 p-1 cursor-pointer transition-colors shrink-0"
              title="Remove handle entry"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};