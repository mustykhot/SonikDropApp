import {
  useAppKit,
  useAppKitAccount,
  useAppKitNetwork,
} from "@reown/appkit/react";
import { useNavigate } from "react-router-dom";
import { formatAddress } from "../utils/helpers";
import {
  IoChevronBackOutline,
  IoChevronDown,
  IoCheckmark,
} from "react-icons/io5";
import { LogoIcon } from "./icons";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { goBack } from "../store/slices/stepSlice";
import { useClearFormInput } from "../hooks/useClearForm";
import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import ClickOutsideWrapper from "./outsideClick";
import { IChains, supportedNetworks } from "../constants/chains";
import { toast } from "react-toastify";
// import { appkit } from "../connection";


export function HeaderComponent({
  showBackButton,
}: {
  showBackButton: boolean;
}) {
  const navigate = useNavigate();
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  const stepToGoBackTo = useAppSelector((state) => state.step.backStack);
  const dispatch = useAppDispatch();

  const handleButtonClick = () => {
    open();
  };

  const { clear } = useClearFormInput();

  const backButton = () => {
    if (stepToGoBackTo.length == 0) {
      clear();
      navigate("/");
    } else {
      dispatch(goBack());
    }
  };

  return (
    <div className="px-2 md:px-[200px]">
      <div className="flex justify-between text-white h-[60px] md:h-[100px] items-center">
        <div
          className="flex gap-2 items-center cursor-pointer"
          tabIndex={0}
          role="button"
          onClick={() => {
            navigate("/");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              navigate("/");
            }
          }}
        >
          
          <LogoIcon />
          <span className="hidden md:block">SonikDrop</span>
        </div>
        <div className="w3m flex gap-2">
          <SwitchChainComp />
          <button
            className="px-4 py-1 rounded-md bg-[#0096E6] text-white"
            onClick={handleButtonClick}
          >
            {isConnected ? (
              formatAddress(address ?? "")
            ) : (
              <>
                <span className="block md:hidden">Connect</span>
                <span className="hidden md:block">Connect Wallet</span>
              </>
            )}
          </button>
        </div>
      </div>
      {showBackButton && (
        <div className="mt-1 mb-2 md:mt-4">
          <button className="flex items-center gap-4" onClick={backButton}>
            <IoChevronBackOutline /> Back
          </button>
        </div>
      )}
    </div>
  );
}

export const SwitchChainComp = () => {
  // const handleSwitchChain = () => {};
  const [showDropdown, setShowdropdown] = useState(false);
  const [selectedChain, setSelectedChain] = useState<IChains | null>(null);
  const { chainId } = useAppKitNetwork();
  const { address } = useAppKitAccount();

  const { open } = useAppKit();

  const setChain = useCallback(
    async (id: number, calledByUser?: boolean) => {
      const chain = supportedNetworks.find((ele) => ele.id === id);
      if (!chain) {
        toast.error("Chain not supported!");
        return;
      }
      if (!address && calledByUser) {
        toast.error("Please connect wallet first!");
        return;
      }
      // Only proceed if the current network ID does not match the requested one
      if (id !== Number(chainId?.toString())) {
        open({ view: "Networks" }); // Open modal to prompt network change
        setShowdropdown(false);
      } else {
        setSelectedChain(chain); // Set the chain if there's no mismatch
      }
    },
    [address, chainId, open]
  );

  useEffect(() => {
    if (!chainId) {
      return;
    }
    setChain(Number(chainId.toString()));
  }, [chainId, setChain]);

  // const [chains, setChains] = useState<IChains>(supportedNetworks);

  return (
    <ClickOutsideWrapper onClickOutside={() => setShowdropdown(false)}>
      <SwitchChainCompStyles>
        <button
          className="border-[2px] px-4 py-1 rounded-md border-[#FFFFFF17] flex items-center gap-1"
          onClick={() => setShowdropdown(!showDropdown)}
        >
          {selectedChain !== null ? (
            <div className="flex gap-1 items-center">
              <span>
                <img
                  src={selectedChain.logo}
                  className="w-[20px] h-[20px] rounded-full"
                />
              </span>
              <span className="hidden md:block">{selectedChain.name}</span>{" "}
              {/* Hide text on mobile */}
            </div>
          ) : (
            <>Not found</>
          )}
          <IoChevronDown size={18} />
        </button>
        {showDropdown && (
          <div className="dropdown absolute">
            {supportedNetworks.map((ele: IChains) => (
              <div
                className="dropdown-item cursor-pointer flex gap-1 items-center"
                key={ele.id}
                onClick={() => setChain(ele.id, true)}
              >
                <img
                  src={ele.logo}
                  className="w-[20px] h-[20px] rounded-full"
                />
                <span className="whitespace-nowrap">{ele.name}</span>
                <span>
                  {ele.id === selectedChain?.id && (
                    <IoCheckmark color="00FF00" />
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </SwitchChainCompStyles>
    </ClickOutsideWrapper>
  );
};

const SwitchChainCompStyles = styled.div`
  position: relative;
  .dropdown {
    background-color: #10173d; /* Dark Navy Blue */
    color: #e0e6f1; /* Off-White Text */
    border: 1px solid #1a2255; /* Deep Indigo border for subtle contrast */
    border-radius: 0.5rem;
    padding: 0.25rem 0.3125rem;
    z-index: 15;
    min-width: 100%;
    width: fit-content;
    margin-top: 0.5rem;
  }

  /* Dropdown items */
  .dropdown-item {
    color: #b0e6ff; /* Light Cyan Text */
    padding: 0.5rem 0.75rem;
    transition: background-color 0.2s;
    display: inline-flex;
    min-width: 100%;
  }

  /* Hover effect for dropdown items */
  .dropdown-item:hover {
    background-color: #15394c; /* Dark Cyan on hover */
    color: #f0f4fa; /* Soft White Text on hover */
  }
`;
