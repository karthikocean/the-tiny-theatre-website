import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Tv,
  Calendar as CalendarIcon,
  User,
  Mail,
  Phone,
  Sparkles,
  Cake as CakeIcon,
  Gift,
  Camera,
  Check,
  ShieldCheck,
  Heart,
  ChevronRight,
  ChevronLeft,
  CreditCard,
  Ticket,
  AlertCircle,
  RefreshCw,
  Volume2,
  Lightbulb,
  MessageSquare,
  Star,
  Mic,
  Wind
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getScreens } from '../Api/screenapi';
import { getImageUrl } from '../Api/api';
import { getAddons } from '../Api/addonsapi';
import { getSlots } from '../Api/slotsapi';
import { getOccasions } from '../Api/occasionsapi';
import { getDecorations } from '../Api/decorationapi';
import { verifyCustomer } from '../Api/CustomerApi';
import { createBooking, addPaymentToBooking } from '../Api/booking';
import { bookingInfo } from '../Api/refundpolicyapi';
import ShowNotifications from '../helper/showNotification';

export default function BookNow({ selectedEventName, clearSelectedEvent }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(1);
  const stepperScrollRef = useRef(null);

  useEffect(() => {
    if (stepperScrollRef.current) {
      const container = stepperScrollRef.current;
      const visibleWidth = container.clientWidth;
      const stepIndex = activeStep - 1; 
      const stepX = 16 + stepIndex * 150;
      const targetScrollLeft = stepX - (visibleWidth / 2);
      container.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: 'smooth'
      });
    }
  }, [activeStep]);

  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const [selectedScreen, setSelectedScreen] = useState(() => {
    return location.state?.selectedScreen || null;
  });
  const [selectedScreenId, setSelectedScreenId] = useState(() => {
    return location.state?.selectedScreenId || null;
  });
  const [selectedDate, setSelectedDate] = useState(() => getTodayDateString());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState(null);

  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    otp: ''
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [refundPolicyData, setRefundPolicyData] = useState(null);
  const [loadingRefundPolicy, setLoadingRefundPolicy] = useState(false);
  const [guestCounts, setGuestCounts] = useState({});
  const [eventCategory, setEventCategory] = useState(selectedEventName || '');
  const [occasionPage, setOccasionPage] = useState(1);
  const occasionsPerPage = 10;
  const [wantsCake, setWantsCake] = useState(false);
  const [selectedCakes, setSelectedCakes] = useState([]); 
  const [cakeFlavor, setCakeFlavor] = useState('Chocolate Truffle');
  const [cakeMessage, setCakeMessage] = useState('');
  const [cakePage, setCakePage] = useState(1);
  const cakesPerPage = 8;
  const [wantsDecor, setWantsDecor] = useState(false);
  const [selectedDecorId, setSelectedDecorId] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [addonQuantities, setAddonQuantities] = useState({});
  const [addonComments, setAddonComments] = useState({});
  const toggleAddon = (key) => {
    setSelectedAddons(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };
  const [addonPage, setAddonPage] = useState(1);
  const addonsPerPage = 8;
  const [bookedSlots, setBookedSlots] = useState(() => {
    try {
      const saved = localStorage.getItem('tiny_theatre_booked_slots');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isPaying, setIsPaying] = useState(false);
  const [bookingId, setBookingId] = useState('');
  useEffect(() => {
    if (selectedEventName) {
      setEventCategory(selectedEventName);
    }
  }, [selectedEventName]);
  const [stepErrors, setStepErrors] = useState({});
  const [screens, setScreens] = useState([]);
  const [loadingScreens, setLoadingScreens] = useState(true);
  useEffect(() => {
    const fetchScreens = async () => {
      try {
        const res = await getScreens();
        if (res && res.status && res.response && res.response.data) {
          const activeScreens = res.response.data.filter(
            (screen) => screen.isActive === 1 && screen.isDelete === 0
          );
          setScreens(activeScreens);
        }
      } catch (err) {
        console.error('Error fetching screens in BookNow:', err);
      } finally {
        setLoadingScreens(false);
      }
    };
    fetchScreens();
  }, []);

  // Dynamic slots fetching
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!selectedScreen || !selectedDate || screens.length === 0) return;

      const screenObj = screens.find(s => s._id === selectedScreenId);

      if (!screenObj || !screenObj._id) return;

      try {
        setLoadingSlots(true);
        const res = await getSlots(screenObj._id, selectedDate);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        if (res && res.data) {
          setAvailableSlots(res.data);
        } else {
          setAvailableSlots([]);
        }
      } catch (err) {
        console.error('Error fetching slots:', err);
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchTimeSlots();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [selectedScreen, selectedDate, screens, selectedScreenId]);

  // Dynamic addons fetching
  const [dbAddons, setDbAddons] = useState([]);
  const [loadingAddons, setLoadingAddons] = useState(true);

  useEffect(() => {
    const fetchAddons = async () => {
      try {
        const res = await getAddons({ type: 'others' });
        if (res && res.status && res.response && res.response.data) {
          const activeAddons = res.response.data.filter(
            (addon) => addon.isActive === 1 && addon.isDelete === 0 && addon.type !== 'cake' && (addon.stock === undefined || addon.stock > 0)
          );
          setDbAddons(activeAddons);
        }
      } catch (err) {
        console.error('Error fetching addons in BookNow:', err);
      } finally {
        setLoadingAddons(false);
      }
    };
    fetchAddons();
  }, []);

  // Dynamic occasions fetching
  const [dbOccasions, setDbOccasions] = useState([]);
  const [loadingOccasions, setLoadingOccasions] = useState(true);

  useEffect(() => {
    const fetchOccasions = async () => {
      try {
        const res = await getOccasions();
        if (res && res.status && res.response && res.response.data) {
          const activeOccasions = res.response.data.filter(
            (occ) => occ.isActive === 1 && occ.isDelete === 0
          );
          setDbOccasions(activeOccasions);
        }
      } catch (err) {
        console.error('Error fetching occasions in BookNow:', err);
      } finally {
        setLoadingOccasions(false);
      }
    };
    fetchOccasions();
  }, []);

  // Dynamic decorations fetching
  const [dbDecorations, setDbDecorations] = useState([]);
  const [loadingDecorations, setLoadingDecorations] = useState(false);

  useEffect(() => {
    const fetchDecorations = async () => {
      setLoadingDecorations(true);
      try {
        const res = await getDecorations();
        if (res && res.status && res.response && res.response.data) {
          const activeDecorations = res.response.data.filter(
            (dec) => (dec.isActive === 1 || dec.isActive === true)
          );
          setDbDecorations(activeDecorations);
        } else {
          setDbDecorations([]);
        }
      } catch (err) {
        console.error('Error fetching decorations in BookNow:', err);
        setDbDecorations([]);
      } finally {
        setLoadingDecorations(false);
      }
    };
    fetchDecorations();
  }, []);

  // Auto-select the first decoration package when screen changes
  useEffect(() => {
    if (selectedScreen && dbDecorations.length > 0) {
      const currentScreenObj = screens.find(s => s._id === selectedScreenId);
      if (currentScreenObj) {
        const screenDecs = dbDecorations.filter(d =>
          d.screen?._id === currentScreenObj._id || d.screen === currentScreenObj._id
        );
        if (screenDecs.length > 0) {
          setSelectedDecorId(screenDecs[0]._id);
        } else {
          setSelectedDecorId(null);
          setWantsDecor(false);
        }
      }
    } else {
      setSelectedDecorId(null);
      setWantsDecor(false);
    }
  }, [selectedScreen, dbDecorations, screens, selectedScreenId]);

  // Dynamic cakes fetching
  const [dbCakes, setDbCakes] = useState([]);
  const [loadingCakes, setLoadingCakes] = useState(false);

  useEffect(() => {
    if (!wantsCake) return;

    const fetchCakes = async () => {
      try {
        setLoadingCakes(true);
        const res = await getAddons({ type: 'cake' });
        if (res && res.status && res.response && res.response.data) {
          const activeCakes = res.response.data.filter(
            (addon) => addon.isActive === 1 && addon.isDelete === 0
          );
          setDbCakes(activeCakes);
        }
      } catch (err) {
        console.error('Error fetching cakes in BookNow:', err);
      } finally {
        setLoadingCakes(false);
      }
    };
    fetchCakes();
  }, [wantsCake]);

  const handleUpdateGuestCount = (catId, newCount) => {
    setGuestCounts(prev => ({
      ...prev,
      [catId]: newCount
    }));
  };

  // Calculations
  const selectedSlotObj = selectedSlotId
    ? availableSlots.find(slot => slot._id === selectedSlotId)
    : null;

  const _topLevelScreenObj = screens.find(s => s._id === selectedScreenId);
  const isScreenB = _topLevelScreenObj ? _topLevelScreenObj.name.toLowerCase().includes('b') : false;

  const basePrice = selectedSlotObj ? selectedSlotObj.price : (isScreenB ? 1799 : 2399);
  const maxCapacity = _topLevelScreenObj ? _topLevelScreenObj.capacity : (isScreenB ? 6 : 15);
  const activeCategories = selectedSlotObj?.ageCategories && selectedSlotObj.ageCategories.length > 0
    ? selectedSlotObj.ageCategories
    : [
      { _id: 'default_adults', name: 'Adults', from: 11, to: 100, price: isScreenB ? 400 : 450 },
      { _id: 'default_kids_3_10', name: 'Kids (3 to 10 Years)', from: 4, to: 10, price: isScreenB ? 200 : 250 },
      { _id: 'default_kids_below_3', name: 'Kids (Below 3 Years)', from: 0, to: 3, price: 0 }
    ];

  const totalGuests = activeCategories.reduce((sum, cat) => sum + Number(guestCounts[cat._id] || 0), 0);

  // Dynamic guest charges calculation (Base price covers up to 4 countable guests)
  const paidCategoriesSorted = [...activeCategories]
    .filter(cat => cat.price > 0)
    .sort((a, b) => b.from - a.from);

  let remainingBaseSpots = 4;
  let additionalGuestCharges = 0;
  const guestChargeBreakdown = [];

  paidCategoriesSorted.forEach(cat => {
    const count = Number(guestCounts[cat._id] || 0);
    const covered = Math.min(count, remainingBaseSpots);
    remainingBaseSpots -= covered;
    const extraCount = count - covered;
    if (extraCount > 0) {
      const charge = extraCount * cat.price;
      additionalGuestCharges += charge;
      guestChargeBreakdown.push({
        name: cat.name || (cat.to >= 100 ? "Adults" : `Kids`),
        count: extraCount,
        rate: cat.price,
        charge
      });
    }
  });

  const kids3to10Charges = 0;

  // Cake prices map
  const cakePrices = {
    'Chocolate Truffle': 800,
    'Red Velvet': 900,
    'Butterscotch': 800,
    'Black Forest': 750
  };
  if (dbCakes && dbCakes.length > 0) {
    dbCakes.forEach((cake) => {
      cakePrices[cake.name] = cake.price;
    });
  }
  const cakeCharges = wantsCake
    ? (selectedCakes.length > 0
        ? selectedCakes.reduce((sum, item) => sum + (cakePrices[item.flavor] || 800), 0)
        : (cakePrices[cakeFlavor] || 800)
      )
    : 0;

  const getAddonIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('photography')) return Camera;
    if (n.includes('videography')) return Camera;
    if (n.includes('speaker')) return Volume2;
    if (n.includes('lighting')) return Lightbulb;
    if (n.includes('message')) return MessageSquare;
    if (n.includes('fog')) return Wind;
    if (n.includes('led')) return Lightbulb;
    if (n.includes('candle')) return Sparkles;
    if (n.includes('sash')) return Star;
    if (n.includes('crown')) return Star;
    if (n.includes('karaoke')) return Mic;
    return Sparkles;
  };

  const getAddonKey = (name) => {
    const n = name.toLowerCase();
    if (n.includes('photography')) return 'photography';
    if (n.includes('videography')) return 'videography';
    if (n.includes('speaker')) return 'speaker';
    if (n.includes('lighting')) return 'lighting';
    if (n.includes('message')) return 'message';
    if (n.includes('fog')) return 'fog_entry';
    if (n.includes('led')) return 'led_numbers';
    if (n.includes('candle')) return 'candle_path';
    if (n.includes('sash')) return 'event_sash';
    if (n.includes('crown')) return 'crown';
    if (n.includes('karaoke')) return 'karaoke';
    return name.replace(/\s+/g, '_').toLowerCase();
  };

  const defaultAddonsPrices = {
    'photography': { name: 'Professional Photography', price: 1500 },
    'videography': { name: 'Cinematic Videography', price: 2500 },
    'speaker': { name: 'Bluetooth Party Speaker', price: 300 },
    'lighting': { name: 'Special Disco Lighting', price: 500 },
    'message': { name: 'Personalized Message on Screen', price: 400 },
    'fog_entry': { name: 'Fog Entry', price: 1000 },
    'led_numbers': { name: 'LED Numbers', price: 300 },
    'candle_path': { name: 'Candle Path', price: 400 },
    'event_sash': { name: 'Event Sash', price: 150 },
    'crown': { name: 'Crown', price: 150 },
    'karaoke': { name: 'Karaoke Setup', price: 800 }
  };

  const addonsPrices = { ...defaultAddonsPrices };
  if (dbAddons && dbAddons.length > 0) {
    dbAddons.forEach((addon) => {
      const name = addon.title || addon.name || '';
      if (name) {
        const key = getAddonKey(name);
        addonsPrices[key] = {
          name: name,
          price: addon.price || 0
        };
      }
    });
  }

  const addonsCharges = selectedAddons.reduce((sum, key) => {
    const price = addonsPrices[key]?.price || 0;
    const qtyStr = addonQuantities[key];
    const qty = qtyStr ? (parseInt(qtyStr, 10) || 1) : 1;
    return sum + (price * qty);
  }, 0);

  const currentScreenObj = screens.find(s => s._id === selectedScreenId);

  const screenDecorations = currentScreenObj
    ? dbDecorations.filter(d => d.screen?._id === currentScreenObj._id || d.screen === currentScreenObj._id)
    : [];

  const activeDecoration = (selectedDecorId && screenDecorations.find(d => d._id === selectedDecorId)) || screenDecorations[0] || null;

  const decorationPrice = activeDecoration ? activeDecoration.price : 0;
  const decorCharges = wantsDecor ? decorationPrice : 0;
  const autoDecoration = wantsDecor ? activeDecoration : null;

  const subtotal = basePrice + additionalGuestCharges + kids3to10Charges + cakeCharges + decorCharges + addonsCharges;
  const totalAmount = subtotal;
  const advancePaymentRequired = 1000;
  const remainingBalance = totalAmount - advancePaymentRequired;

  // Dynamic Refund Policy fetching using API with params
  useEffect(() => {
    const fetchRefundPolicyContent = async () => {
      try {
        setLoadingRefundPolicy(true);
        const res = await bookingInfo({});
        if (res && res.status && res.response) {
          if (Array.isArray(res.response.data) && res.response.data.length > 0) {
            setRefundPolicyData(res.response.data[0]);
          } else if (res.response.data && typeof res.response.data === 'object') {
            setRefundPolicyData(res.response.data);
          } else {
            setRefundPolicyData(res.response);
          }
        }
      } catch (err) {
        console.error("Error loading refund policy:", err);
      } finally {
        setLoadingRefundPolicy(false);
      }
    };

    fetchRefundPolicyContent();
  }, [selectedScreenId, selectedDate, selectedSlotId, totalGuests, eventCategory, totalAmount]);

  // Mock OTP handlers
  const handleSendOtp = () => {
    const cleanedPhone = (customerInfo.phone || '').replace(/\D/g, '');
    if (!cleanedPhone || !/^[6-9]\d{9}$/.test(cleanedPhone)) {
      setStepErrors({ phone: 'Please enter a valid 10-digit mobile number starting with 6-9.' });
      return;
    }
    setStepErrors({});
    setSendingOtp(true);
    setTimeout(() => {
      setSendingOtp(false);
      const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(newOtp);
      setOtpSent(true);
      setOtpError('');
    }, 1200);
  };

  const handleVerifyOtp = async () => {
    if (!customerInfo.otp) {
      setOtpError('Please enter OTP');
    } else if (customerInfo.otp === generatedOtp) {
      setOtpError('');
      setStepErrors({});
      setOtpVerified(true);
      ShowNotifications.showAlertNotification("Customer verified successfully", true);
      try {
        await verifyCustomer({
          name: customerInfo.fullName,
          email: customerInfo.email,
          mobileNumber: customerInfo.phone
        });
      } catch (err) {
        console.warn("Backend customer verification failed:", err);
      }
    } else {
      setOtpError('Invalid OTP');
    }
  };

  // Next Step Disabled helper
  // Consolidated 4 Steps:
  // 1 = Screen, Slot & Guests
  // 2 = Occasion, Cake & Decor
  // 3 = Add-ons
  // 4 = Customer Details & Payment
  const isNextDisabled = () => {
    if (activeStep === 1) {
      return !selectedScreen || !selectedDate || !selectedTimeSlot;
    }
    if (activeStep === 2) {
      return !eventCategory;
    }
    return false;
  };

  // Step Validation logic before proceeding
  const handleNextStep = () => {
    const errors = {};
    if (activeStep === 1) {
      if (!selectedScreen) errors.screen = 'Please select a screening hall to continue.';
      if (!selectedDate) errors.date = 'Date selection is required.';
      if (!selectedTimeSlot) errors.time = 'Please select a preferred time slot.';
      if (totalGuests === 0) errors.guests = 'Please select at least 1 guest.';
      if (totalGuests > maxCapacity) errors.guests = `Selected screen capacity is max ${maxCapacity} guests. Please contact the team.`;
      if (Object.keys(errors).length > 0) {
        setStepErrors(errors);
        return;
      }
    }

    if (activeStep === 2) {
      if (!eventCategory) {
        errors.occasion = 'Please select an occasion to continue.';
        setStepErrors(errors);
        return;
      }
    }

    setStepErrors({});
    setActiveStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStepErrors({});
    setActiveStep(prev => Math.max(1, prev - 1));
  };

  // Payment Action with T&C verification & DB state saving
  const handlePayment = async () => {
    const errors = {};
    if (!customerInfo.fullName.trim()) {
      errors.fullName = 'Full Name is required.';
    } else if (/\d/.test(customerInfo.fullName)) {
      errors.fullName = 'Full Name cannot contain numbers.';
    }
    if (!customerInfo.email.trim() || !/\S+@\S+\.\S+/.test(customerInfo.email)) {
      errors.email = 'Please provide a valid email.';
    }
    const cleanedPhone = (customerInfo.phone || '').replace(/\D/g, '');
    if (!customerInfo.phone.trim()) {
      errors.phone = 'Mobile number is required.';
    } else if (!/^[6-9]\d{9}$/.test(cleanedPhone)) {
      errors.phone = 'Please enter a valid 10-digit mobile number starting with 6-9.';
    }
    if (!otpVerified) {
      if (customerInfo.otp === generatedOtp && generatedOtp !== '') {
        setOtpVerified(true);
      } else {
        errors.otp = 'Please verify your phone number via OTP first.';
      }
    }
    if (!termsAccepted) {
      errors.terms = 'You must accept the Terms & Conditions to proceed with payment.';
    }

    if (Object.keys(errors).length > 0) {
      setStepErrors(errors);
      return;
    }

    setIsPaying(true);

    try {
      const screenObj = screens.find(s => s._id === selectedScreenId);
      const occasionObj = dbOccasions.find(o => o.name === eventCategory);
      
      const addonIds = selectedAddons.map(key => {
        const addon = dbAddons.find(a => getAddonKey(a.name) === key);
        return addon ? addon._id : null;
      }).filter(Boolean);

      const hasKids = activeCategories.some(cat => {
        const isAdult = cat.to >= 100 || cat.from >= 10;
        const count = Number(guestCounts[cat._id] || 0);
        return !isAdult && count > 0;
      });
      const ageCategoryVal = hasKids ? 'Mixed' : 'Adults';
      let selectedCakeIds = [];
      let consolidatedCakeComment = '';
      if (wantsCake) {
        if (selectedCakes.length > 0) {
          selectedCakes.forEach(item => {
            const cakeObj = dbCakes.find(c => c.name === item.flavor);
            if (cakeObj) {
              selectedCakeIds.push(cakeObj._id);
            }
          });
          consolidatedCakeComment = selectedCakes
            .map(sc => {
              const msg = sc.message ? sc.message.trim() : '';
              return msg ? `${sc.flavor}: ${msg}` : '';
            })
            .filter(Boolean)
            .join(' | ');
        } else if (cakeFlavor) {
          const cakeObj = dbCakes.find(c => c.name === cakeFlavor);
          if (cakeObj) {
            selectedCakeIds.push(cakeObj._id);
          }
          const msg = cakeMessage ? cakeMessage.trim() : '';
          consolidatedCakeComment = msg ? `${cakeFlavor}: ${msg}` : '';
        }
      }

      const addonQuantitiesToSend = {};
      const addonDetailsToSend = [];

      selectedAddons.forEach(key => {
        const addon = dbAddons.find(a => getAddonKey(a.name) === key);
        let comment = addonComments[key] || '';

        if (addon) {
          addonQuantitiesToSend[addon._id] = "1";
          addonQuantitiesToSend[addon.name] = "1";
          addonDetailsToSend.push({
            addon: addon._id,
            quantity: 1,
            comment: comment.trim() || undefined
          });
        }
        addonQuantitiesToSend[key] = "1";
      });

      if (wantsCake) {
        if (selectedCakes.length > 0) {
          selectedCakes.forEach(sc => {
            const cakeObj = dbCakes.find(c => c.name === sc.flavor);
            if (cakeObj) {
              addonDetailsToSend.push({
                addon: cakeObj._id,
                quantity: 1,
                comment: sc.message ? sc.message.trim() : undefined
              });
            }
          });
        } else if (cakeFlavor) {
          const cakeObj = dbCakes.find(c => c.name === cakeFlavor);
          if (cakeObj) {
            addonDetailsToSend.push({
              addon: cakeObj._id,
              quantity: 1,
              comment: cakeMessage ? cakeMessage.trim() : undefined
            });
          }
        }
      }

      const bookingData = {
        screen: screenObj._id,
        bookingDate: selectedDate,
        slot: selectedSlotObj._id,
        customerName: customerInfo.fullName,
        email: customerInfo.email,
        mobile: customerInfo.phone,
        ageCategory: ageCategoryVal,
        ageCategoryCounts: guestCounts,
        count: totalGuests,
        occasion: occasionObj ? occasionObj._id : null,
        cakeSelection: wantsCake,
        cakeComment: wantsCake ? consolidatedCakeComment : undefined,
        selectedCakeId: selectedCakeIds,
        decoration: wantsDecor,
        decorationId: wantsDecor && autoDecoration ? autoDecoration._id : undefined,
        addons: addonIds,
        addonQuantities: addonQuantitiesToSend,
        addonDetails: addonDetailsToSend,
        totalAmount: totalAmount,
        termsAccepted: true,
        isTermsAccepted: true
      };

      const res = await createBooking(bookingData);
      if (res.status) {
        if (advancePaymentRequired > 0) {
          await addPaymentToBooking(res.response.data._id, {
            amount: advancePaymentRequired,
            method: paymentMethod
          });
        }
        setBookingId(res.response.data.bookingId || `TT-${Math.floor(10000 + Math.random() * 90000)}`);

        setActiveStep(5);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#F4C430', '#14C299', '#ffffff']
        });
      } else {
        // ShowNotifications.showAlertNotification(res.message || "An error occurred during booking.", false);
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      }
    } catch (err) {
      console.error(err);
      // ShowNotifications.showAlertNotification("An error occurred during booking.", false);
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    } finally {
      setIsPaying(false);
    }
  };

  const handleReset = () => {
    window.location.href = window.location.pathname + '#book-now';
    window.location.reload();
  };

  const stepNames = [
    'Screen, Slot & Guest',
    'Occasion, Cake & Decor',
    'Add-ons',
    'Customer & Payment'
  ];

  return (
    <section id="book-now" className={`relative bg-theatre-dark/95 overflow-x-hidden min-h-screen transition-all duration-500 ${activeStep === 5 ? 'py-6 md:py-8' : 'pt-16 pb-20 sm:py-16'
      }`}>
      {/* Visual backgrounds */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-theatre-grey/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-theatre-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[85rem] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">

        {/* 4 Consolidated Progress Steps Bar */}
        {activeStep <= 4 && (
          <div ref={stepperScrollRef} className="w-full max-w-5xl mx-auto mb-12 overflow-x-auto pb-4 scrollbar-thin">
            <div className="flex items-center justify-between min-w-[650px] px-4">
              {stepNames.map((name, index) => {
                const stepNum = index + 1;
                const isCompleted = activeStep > stepNum;
                const isActive = activeStep === stepNum;
                return (
                  <div key={name} className="flex items-center flex-grow last:flex-grow-0">
                    <div className="flex flex-col items-center relative">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-sans text-xs font-bold transition-all duration-300 border ${isCompleted
                          ? 'bg-theatre-gold border-theatre-gold text-theatre-grey-deep'
                          : isActive
                            ? 'bg-transparent border-theatre-gold text-theatre-gold shadow-md shadow-theatre-gold/20 scale-110'
                            : 'bg-theatre-grey-deep/30 border-white/10 text-gray-500'
                          }`}
                      >
                        {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
                      </div>
                      <span className={`text-[11px] mt-2 font-medium tracking-wide uppercase transition-colors duration-300 text-center whitespace-nowrap ${isActive ? 'text-theatre-gold font-bold' : 'text-gray-500'
                        }`}>
                        {name}
                      </span>
                    </div>
                    {index < stepNames.length - 1 && (
                      <div className={`h-0.5 flex-grow mx-4 rounded-full transition-colors duration-500 ${isCompleted ? 'bg-theatre-gold/60' : 'bg-white/5'
                        }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start max-w-6xl mx-auto mb-4">

          {/* LEFT PANEL: Combined Wizard Steps */}
          <div className={`col-span-1 bg-theatre-grey-deep/20 backdrop-blur-md border border-white/5 rounded-3xl flex flex-col justify-between transition-all duration-300 mx-2 sm:mx-0 ${activeStep === 5
            ? 'lg:col-span-12 p-4 sm:p-6 pt-2 sm:pt-2 min-h-0'
            : 'lg:col-span-8 p-6 sm:px-8 sm:pt-8 max-sm:pb-24 pb-20 min-h-[480px]'
            }`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-grow"
              >
                {/* STEP 1: Screen, Slot & Guests */}
                {activeStep === 1 && (
                  <div className="space-y-8 max-w-3xl mx-auto w-full">
                    <div className="space-y-1 text-center py-2 border-b border-white/5 pb-4">
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">Step 1: Screen, Slot & Guest Selection</h3>
                      <p className="text-xs sm:text-sm text-gray-400">Choose your private screening hall, select an available date & time slot, and specify your guest count.</p>
                    </div>

                    {/* 1.1: Screen Selection */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 text-theatre-gold font-serif font-bold text-base">
                        <Tv className="w-5 h-5" />
                        <h4>1. Select Screening Hall</h4>
                      </div>

                      {stepErrors.screen && (
                        <div className="p-3.5 bg-red-950/30 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center space-x-2">
                          <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
                          <span>{stepErrors.screen}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {screens && screens.length > 0 ? screens.map((screen) => {
                          const screenCode = screen.name.toLowerCase().includes('b') ? 'B' : 'A';
                          const isSelected = selectedScreenId === screen._id;

                          const pricingInfo = screenCode === 'A' ? {
                            fallbackImg: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80'
                          } : {
                            fallbackImg: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=400&q=80'
                          };

                          return (
                            <div
                              key={screen._id || screenCode}
                              onClick={() => { setSelectedScreen(screen.name); setSelectedScreenId(screen._id); setSelectedTimeSlot(''); setSelectedSlotId(null); setStepErrors({}); }}
                              className={`rounded-2xl overflow-hidden bg-theatre-dark/40 border cursor-pointer group transition-all duration-300 flex flex-col ${isSelected
                                ? 'border-theatre-gold shadow-lg shadow-theatre-gold/15 scale-[1.01]'
                                : 'border-white/10 hover:border-white/20'
                                }`}
                            >
                              <div className="relative h-48 sm:h-52 overflow-hidden bg-gray-900">
                                <img
                                  src={typeof screen.image === 'string' && screen.image.startsWith('http') ? screen.image : getImageUrl(screen.image?.path || screen.image)}
                                  alt={screen.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = pricingInfo.fallbackImg;
                                  }}
                                />
                              </div>
                              <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                                <div className="space-y-1">
                                  <h5 className="text-base font-serif font-bold text-white">{screen.name}</h5>
                                  <p className="text-xs text-gray-400 font-light leading-relaxed line-clamp-2">
                                    {screen.description}
                                  </p>
                                </div>
                                <div className="space-y-1.5 border-t border-white/5 pt-2">
                                  <div className="flex justify-between items-baseline text-xs">
                                    <span className="text-gray-500">Capacity:</span>
                                    <span className="text-white font-semibold">Up to {screen.capacity} Members</span>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  className={`w-full py-2 rounded-xl font-sans text-xs font-bold transition-all duration-300 ${isSelected
                                    ? 'bg-theatre-gold text-theatre-grey-deep shadow-md'
                                    : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                                    }`}
                                >
                                  {isSelected ? 'Selected' : 'Select Screen'}
                                </button>
                              </div>
                            </div>
                          );
                        }) : <div className="col-span-full py-6 text-center text-gray-400">No screens currently available.</div>}
                      </div>
                    </div>

                    {/* 1.2: Date & Slot Picker */}
                    <div className="space-y-4 pt-4 border-t border-white/5">
                      <div className="flex items-center space-x-2 text-theatre-gold font-serif font-bold text-base">
                        <CalendarIcon className="w-5 h-5" />
                        <h4>2. Select Date & Time Slot</h4>
                      </div>

                      <div className="flex flex-col gap-6">
                        {/* Date Picker */}
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-gray-300 block">Select Date</label>
                          <div className="relative">
                            <input
                              type="date"
                              min={new Date().toISOString().split('T')[0]}
                              value={selectedDate}
                              onChange={(e) => { setSelectedDate(e.target.value); setSelectedTimeSlot(''); setSelectedSlotId(null); setStepErrors({}); }}
                              onClick={(e) => { try { e.target.showPicker(); } catch (err) { } }}
                              onFocus={(e) => { try { e.target.showPicker(); } catch (err) { } }}
                              className="w-full bg-theatre-dark/60 text-white pl-4 pr-10 py-3 rounded-xl border border-white/10 focus:border-theatre-gold outline-none transition-all duration-300 text-sm font-sans scheme-dark cursor-pointer"
                            />
                            <CalendarIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-theatre-gold pointer-events-none" />
                          </div>
                          {stepErrors.date && (
                            <p className="text-red-400 text-xs flex items-center space-x-1">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>{stepErrors.date}</span>
                            </p>
                          )}
                        </div>

                        {/* Time Slots */}
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-gray-300 block">Available Time Slots</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                            {loadingSlots ? (
                              Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="py-2.5 px-3 rounded-xl border border-white/5 bg-white/5 animate-pulse flex flex-col gap-2">
                                  <div className="h-3.5 bg-white/10 rounded w-3/4 mb-0.5"></div>
                                  <div className="flex justify-between items-center mt-1">
                                    <div className="h-2.5 bg-white/10 rounded w-10"></div>
                                    <div className="h-2.5 bg-white/10 rounded w-12"></div>
                                  </div>
                                </div>
                              ))
                            ) : availableSlots.length > 0 ? availableSlots.map(slotItem => {
                              const isApiSlot = !!slotItem._id;
                              const formatTime = (t) => {
                                if (!t) return '';
                                const d = new Date(t);
                                if (isNaN(d.getTime())) return t;
                                let h = d.getHours();
                                const m = String(d.getMinutes()).padStart(2, '0');
                                const ampm = h >= 12 ? 'PM' : 'AM';
                                h = h % 12 || 12;
                                return `${h}:${m} ${ampm}`;
                              };
                              let slotLabel = '';
                              if (isApiSlot) {
                                slotLabel = `${slotItem.slotName} (${formatTime(slotItem.startTime)} to ${formatTime(slotItem.endTime)})`;
                              } else {
                                slotLabel = `${slotItem.startTime} to ${slotItem.endTime} (3 hours)`;
                              }

                              const isSelected = selectedTimeSlot === slotLabel;
                              const isBooked = (isApiSlot && slotItem.isBooked) || bookedSlots.some(b =>
                                b.screen === selectedScreenId &&
                                b.date === selectedDate &&
                                b.slot === slotLabel
                              );

                              return (
                                <button
                                  type="button"
                                  key={isApiSlot ? slotItem._id : slotLabel}
                                  onClick={() => {
                                    if (!isBooked) {
                                      setSelectedTimeSlot(slotLabel);
                                      setSelectedSlotId(isApiSlot ? slotItem._id : null);
                                      setStepErrors({});
                                    }
                                  }}
                                  disabled={isBooked}
                                  className={`py-2.5 px-3 rounded-xl text-left border transition-all duration-300 text-xs font-sans ${isSelected
                                    ? 'border-theatre-gold bg-theatre-gold/10 text-theatre-gold shadow-md'
                                    : isBooked
                                      ? 'border-red-500/40 bg-red-500/20 text-gray-400 cursor-not-allowed'
                                      : 'border-white/10 bg-theatre-dark/40 text-gray-300 hover:border-white/20'
                                    }`}
                                >
                                  <div className="font-bold mb-0.5 text-[11px] leading-snug whitespace-normal break-words">{slotLabel}</div>
                                  <div className="text-[9px] uppercase tracking-widest flex items-center justify-between">
                                    {isApiSlot && slotItem.price != null ? (
                                      <span className="text-theatre-gold font-bold normal-case text-xs">₹{slotItem.price}</span>
                                    ) : (
                                      <span className="text-gray-500">Slot</span>
                                    )}
                                    {isBooked ? (
                                      <span className="text-red-500 font-semibold capitalize">Booked</span>
                                    ) : (
                                      <span className="text-green-500 font-semibold capitalize">Available</span>
                                    )}
                                  </div>
                                </button>
                              );
                            }) : <div className="col-span-full py-4 text-center text-xs text-gray-400">Select date & screen to view slots.</div>}
                          </div>
                          {stepErrors.time && (
                            <p className="text-red-400 text-xs flex items-center space-x-1">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>{stepErrors.time}</span>
                            </p>
                          )}
                          
                          {selectedTimeSlot && (
                            <div className="mt-5 p-5 bg-[#17191D] border border-white/10 rounded-2xl relative overflow-hidden font-sans">
                              {/* BASE PRICE SECTION */}
                              <div className="flex justify-between items-start mb-6">
                                <div>
                                  <h5 className="text-white font-bold text-sm sm:text-base uppercase tracking-wider mb-1">Base Price</h5>
                                  <p className="text-gray-400 text-[11px] sm:text-xs">Covers up to 4 members</p>
                                </div>
                                <div className="text-right">
                                  <h5 className="text-theatre-gold font-bold text-xl leading-none mb-1.5">₹{basePrice}</h5>
                                  <p className="text-gray-500 text-[10px]">(Inc. GST)</p>
                                </div>
                              </div>
                              
                              <div className="w-full h-[1px] bg-white/10 mb-6" />

                              {/* ADDITIONAL GUEST CHARGES */}
                              <div className="mb-6">
                                <h6 className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-3">Additional Guest Charges (Above 4 Members)</h6>
                                <div className="border border-white/10 rounded-xl overflow-hidden bg-black/20">
                                  {activeCategories.map((cat, idx) => {
                                    const ageLabel = cat.to >= 100
                                      ? `${cat.from}+ Years`
                                      : `${cat.from} - ${cat.to} Years`;
                                      
                                    const isFree = cat.price === 0;
                                    return (
                                      <div key={cat._id} className={`flex justify-between items-center px-4 py-4 ${idx !== activeCategories.length - 1 ? 'border-b border-white/5' : ''}`}>
                                        <span className="text-white text-[13px] sm:text-sm font-bold">{ageLabel}</span>
                                        <div className="flex items-center gap-1.5">
                                          {isFree ? (
                                            <span className="text-[#10B981] font-bold text-[13px] sm:text-sm">FREE</span>
                                          ) : (
                                            <span className="text-white font-bold text-[13px] sm:text-sm">₹{cat.price} <span className="text-gray-400 font-medium text-xs">/ each</span></span>
                                          )}
                                          <span className="text-gray-500 text-[10px] ml-1 hidden sm:inline">(Inc. GST)</span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Dynamic Added Members summary (if any) */}
                              {/* {guestChargeBreakdown && guestChargeBreakdown.length > 0 && (
                                <div className="mb-6 space-y-2">
                                  {guestChargeBreakdown.map((charge, idx) => (
                                    <div key={idx} className="flex justify-between items-center px-2">
                                      <span className="text-gray-400 text-xs font-medium">Added: {charge.description}</span>
                                      <span className="text-white text-xs font-bold">+ ₹{charge.amount}</span>
                                    </div>
                                  ))}
                                </div>
                              )} */}

                              {/* Footer Warning */}
                              <div className="border border-theatre-gold/30 bg-theatre-gold/[0.04] rounded-xl py-3.5 px-4 text-center border-dashed">
                                <p className="text-theatre-gold text-xs font-bold">All prices shown are final and inclusive of GST.</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 1.3: Guest Count Selection */}
                    <div className="space-y-4 pt-4 border-t border-white/5">
                      <div className="flex items-center space-x-2 text-theatre-gold font-serif font-bold text-base">
                        <User className="w-5 h-5" />
                        <h4>3. Guest Count Details</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[...activeCategories].sort((a, b) => b.from - a.from).map((category) => {
                          const count = guestCounts[category._id] || 0;
                          const isFree = category.price === 0;

                          const ageLabel = category.to >= 100
                            ? `Ages ${category.from}+`
                            : `Ages ${category.from} to ${category.to} Yrs`;

                          const rateDesc = isFree ? "Free" : `₹${category.price} / each`;

                          return (
                            <div key={category._id} className="flex items-center justify-between bg-theatre-dark/40 p-3.5 border border-white/5 rounded-2xl">
                              <div className="space-y-0.5">
                                <span className="text-xs font-semibold text-white block">
                                  {category.name || (category.to >= 100 ? "Adults" : `Kids`)}
                                </span>
                                <span className={`text-[11px] ${isFree ? 'text-green-500 font-bold' : 'text-gray-400'}`}>
                                  {ageLabel} ({rateDesc})
                                </span>
                              </div>
                              <div className="flex items-center space-x-3 flex-shrink-0 ml-2">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateGuestCount(category._id, Math.max(0, count - 1))}
                                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center font-bold text-sm cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="font-sans font-bold text-sm w-5 text-center text-white">{count}</span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateGuestCount(category._id, count + 1)}
                                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center font-bold text-sm cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-3 bg-theatre-grey-deep/30 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                        <span className="text-gray-400">Selected Guests: <strong className="text-white">{totalGuests} Members</strong></span>
                        <span className="text-theatre-gold">Max Allowed: <strong>{maxCapacity} Members</strong></span>
                      </div>

                      {stepErrors.guests && (
                        <div className="p-3 bg-red-950/30 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center space-x-2">
                          <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
                          <span>{stepErrors.guests}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 2: Occasion, Cake & Decoration */}
                {activeStep === 2 && (
                  <div className="space-y-8 max-w-3xl mx-auto w-full">
                    <div className="space-y-1 text-center py-2 border-b border-white/5 pb-4">
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">Step 2: Occasion, Cake & Decoration</h3>
                      <p className="text-xs sm:text-sm text-gray-400">Select the event occasion you are celebrating and optional add-on cakes & decor packages.</p>
                    </div>

                    {/* 2.1: Occasions Grid */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 text-theatre-gold font-serif font-bold text-base">
                        <Sparkles className="w-5 h-5" />
                        <h4>1. Choose Occasion</h4>
                      </div>

                      {stepErrors.occasion && (
                        <div className="p-3.5 bg-red-950/30 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center space-x-2">
                          <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
                          <span>{stepErrors.occasion}</span>
                        </div>
                      )}

                      {(() => {
                        if (!dbOccasions || dbOccasions.length === 0) {
                          return <div className="py-4 text-center text-xs text-gray-400">No occasions currently available.</div>;
                        }
                        const occasionList = dbOccasions.map(cat => ({
                          name: cat.name,
                          image: cat.image ? getImageUrl(cat.image) : '/movie.png',
                          fallback: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=400&q=80'
                        }));
                        const totalOccasionPages = Math.ceil(occasionList.length / occasionsPerPage);
                        const paginatedOccasions = occasionList.slice((occasionPage - 1) * occasionsPerPage, occasionPage * occasionsPerPage);

                        return (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                              {paginatedOccasions.map(cat => {
                                const isSelected = eventCategory === cat.name;
                                return (
                                  <div
                                    key={cat.name}
                                    onClick={() => setEventCategory(cat.name)}
                                    className="flex flex-col items-center cursor-pointer group select-none"
                                  >
                                    <div className={`relative w-full h-32 rounded-2xl overflow-hidden transition-all duration-300 border ${isSelected
                                      ? 'border-theatre-gold bg-gradient-to-t from-theatre-gold/20 to-theatre-gold/5 shadow-md shadow-theatre-gold/15 scale-[1.02]'
                                      : 'border-white/10 bg-theatre-dark/40 hover:border-white/20'
                                      }`}>
                                      {isSelected && (
                                        <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-theatre-gold text-theatre-grey-deep flex items-center justify-center z-10 shadow-md">
                                          <Check className="w-3 h-3" />
                                        </span>
                                      )}
                                      <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className={`w-full h-full object-cover transition-transform duration-500 ${isSelected ? 'scale-105 brightness-90' : 'group-hover:scale-105'
                                          }`}
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = cat.fallback;
                                        }}
                                      />
                                    </div>

                                    <span className={`mt-2 text-[10px] font-sans font-bold uppercase tracking-wider text-center h-6 flex items-center justify-center transition-colors duration-300 ${isSelected ? 'text-theatre-gold font-extrabold' : 'text-gray-400 group-hover:text-white'
                                      }`}>
                                      {cat.name}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>

                            {totalOccasionPages > 1 && (
                              <div className="flex items-center justify-end space-x-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => setOccasionPage(prev => Math.max(1, prev - 1))}
                                  disabled={occasionPage === 1}
                                  className="p-1.5 rounded-lg border border-white/10 bg-theatre-dark/40 text-gray-400 hover:text-white disabled:opacity-30 transition-all cursor-pointer"
                                >
                                  <ChevronLeft className="w-4 h-4" />
                                </button>
                                <span className="text-xs text-gray-400 font-sans px-2">
                                  Page {occasionPage} of {totalOccasionPages}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setOccasionPage(prev => Math.min(totalOccasionPages, prev + 1))}
                                  disabled={occasionPage === totalOccasionPages}
                                  className="p-1.5 rounded-lg border border-white/10 bg-theatre-dark/40 text-gray-400 hover:text-white disabled:opacity-30 transition-all cursor-pointer"
                                >
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    {/* 2.2: Cake Selection */}
                    <div className="space-y-4 pt-4 border-t border-white/5">
                      <div className="flex items-center space-x-2 text-theatre-gold font-serif font-bold text-base">
                        <CakeIcon className="w-5 h-5" />
                        <h4>2. Cake Selection (Optional)</h4>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => setWantsCake(true)}
                          className={`px-5 py-2.5 rounded-xl border text-xs font-sans font-bold tracking-wider transition-all duration-300 cursor-pointer ${wantsCake
                            ? 'bg-theatre-gold border-theatre-gold text-theatre-grey-deep'
                            : 'bg-white/5 border-white/10 text-gray-300'
                            }`}
                        >
                          Yes, Include Cake
                        </button>
                        <button
                          type="button"
                          onClick={() => setWantsCake(false)}
                          className={`px-5 py-2.5 rounded-xl border text-xs font-sans font-bold tracking-wider transition-all duration-300 cursor-pointer ${!wantsCake
                            ? 'bg-theatre-gold border-theatre-gold text-theatre-grey-deep'
                            : 'bg-white/5 border-white/10 text-gray-300'
                            }`}
                        >
                          No, Skip Cake
                        </button>
                      </div>

                      {wantsCake && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-4 pt-2"
                        >
                          {loadingCakes ? (
                            <div className="flex items-center space-x-2 text-xs text-gray-400 py-4 justify-center">
                              <RefreshCw className="w-4 h-4 animate-spin text-theatre-gold" />
                              <span>Loading cakes list...</span>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {(() => {
                                  if (!dbCakes || dbCakes.length === 0) return <div className="col-span-full py-4 text-center text-xs text-gray-400">No cakes available.</div>;
                                  const cakeList = dbCakes.map(cake => ({
                                    flavor: cake.name,
                                    price: `₹${cake.price.toLocaleString('en-IN')}`,
                                    rawPrice: cake.price,
                                    img: getImageUrl(cake.image?.path || cake.image)
                                  }));
                                  const totalCakePages = Math.ceil(cakeList.length / cakesPerPage);
                                  const paginatedCakes = cakeList.slice((cakePage - 1) * cakesPerPage, cakePage * cakesPerPage);
                                  return paginatedCakes.map(cake => {
                                    const isSelected = selectedCakes.some(sc => sc.flavor === cake.flavor);
                                    const selectedEntry = selectedCakes.find(sc => sc.flavor === cake.flavor);
                                    return (
                                      <div
                                        key={cake.flavor}
                                        onClick={() => {
                                          setCakeFlavor(cake.flavor);
                                          setSelectedCakes(prev => {
                                            if (prev.some(sc => sc.flavor === cake.flavor)) {
                                              return prev.filter(sc => sc.flavor !== cake.flavor);
                                            } else {
                                              return [...prev, { flavor: cake.flavor, message: '' }];
                                            }
                                          });
                                        }}
                                        className={`rounded-xl overflow-hidden border cursor-pointer bg-theatre-dark/40 transition-all duration-300 relative ${isSelected
                                          ? 'border-theatre-gold shadow-md shadow-theatre-gold/10 scale-102 bg-theatre-gold/5'
                                          : 'border-white/10 hover:border-white/20'
                                          }`}
                                      >
                                        {isSelected && (
                                          <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-theatre-gold text-theatre-grey-deep flex items-center justify-center z-10 shadow-md">
                                            <Check className="w-3 h-3" />
                                          </span>
                                        )}
                                        <div className="h-24 sm:h-28 bg-gray-900 overflow-hidden">
                                          <img src={cake.img} alt={cake.flavor} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="pt-2 pb-2 px-2 text-center space-y-0.5">
                                          <h4 className="text-xs font-bold text-white truncate">{cake.flavor}</h4>
                                          <span className="text-xs text-theatre-gold font-bold">{cake.price}</span>
                                        </div>
                                        {isSelected && (
                                          <input
                                            type="text"
                                            maxLength={30}
                                            onClick={(e) => e.stopPropagation()}
                                            value={selectedEntry?.message || ''}
                                            onChange={(e) => {
                                              const val = e.target.value;
                                              setSelectedCakes(prev => prev.map(sc =>
                                                sc.flavor === cake.flavor ? { ...sc, message: val } : sc
                                              ));
                                            }}
                                            placeholder={`Message for ${cake.flavor}`}
                                            className="w-full bg-theatre-dark/60 text-white px-2.5 py-1.5 border-t border-theatre-gold/30 focus:border-theatre-gold outline-none text-[10px] placeholder:text-gray-600"
                                          />
                                        )}
                                      </div>
                                    );
                                  });
                                })()}
                              </div>

                              {(() => {
                                const totalItems = dbCakes ? dbCakes.length : 0;
                                const totalCakePages = Math.ceil(totalItems / cakesPerPage);
                                return totalCakePages > 1 ? (
                                  <div className="flex items-center justify-end space-x-2 pt-1">
                                    <button
                                      type="button"
                                      onClick={() => setCakePage(prev => Math.max(1, prev - 1))}
                                      disabled={cakePage === 1}
                                      className="p-1.5 rounded-lg border border-white/10 bg-theatre-dark/40 text-gray-400 hover:text-white disabled:opacity-30 transition-all cursor-pointer"
                                    >
                                      <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <span className="text-xs text-gray-400 font-sans px-2">
                                      Page {cakePage} of {totalCakePages}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => setCakePage(prev => Math.min(totalCakePages, prev + 1))}
                                      disabled={cakePage === totalCakePages}
                                      className="p-1.5 rounded-lg border border-white/10 bg-theatre-dark/40 text-gray-400 hover:text-white disabled:opacity-30 transition-all cursor-pointer"
                                    >
                                      <ChevronRight className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : null;
                              })()}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>

                    {/* 2.3: Decoration Package */}
                    {screenDecorations.length > 0 && (
                      <div className="space-y-4 pt-4 border-t border-white/5">
                        <div className="flex items-center space-x-2 text-theatre-gold font-serif font-bold text-base">
                          <Gift className="w-5 h-5" />
                          <h4>3. Decoration Package (Optional)</h4>
                        </div>

                        <div className="flex items-center space-x-3">
                          <button
                            type="button"
                            onClick={() => setWantsDecor(true)}
                            className={`px-5 py-2.5 rounded-xl border text-xs font-sans font-bold tracking-wider transition-all duration-300 cursor-pointer ${wantsDecor
                              ? 'bg-theatre-gold border-theatre-gold text-theatre-grey-deep'
                              : 'bg-white/5 border-white/10 text-gray-300'
                              }`}
                          >
                            Yes, Include Decor {decorationPrice > 0 ? `(₹${decorationPrice})` : ''}
                          </button>
                          <button
                            type="button"
                            onClick={() => setWantsDecor(false)}
                            className={`px-5 py-2.5 rounded-xl border text-xs font-sans font-bold tracking-wider transition-all duration-300 cursor-pointer ${!wantsDecor
                              ? 'bg-theatre-gold border-theatre-gold text-theatre-grey-deep'
                              : 'bg-white/5 border-white/10 text-gray-300'
                              }`}
                          >
                            No, Skip Decor
                          </button>
                        </div>

                        {wantsDecor && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="pt-2"
                          >
                            {loadingDecorations ? (
                              <div className="p-4 rounded-xl border border-white/10 bg-white/5 text-gray-400 text-xs text-center">
                                Loading decorations...
                              </div>
                            ) : screenDecorations.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {screenDecorations.map((decor) => {
                                  const isSelected = selectedDecorId === decor._id || (!selectedDecorId && screenDecorations[0]?._id === decor._id);
                                  return (
                                    <div
                                      key={decor._id}
                                      onClick={() => setSelectedDecorId(decor._id)}
                                      className={`relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${isSelected
                                        ? 'border-theatre-gold bg-gradient-to-t from-theatre-gold/20 to-theatre-gold/5 shadow-md shadow-theatre-gold/15 scale-[1.01]'
                                        : 'border-white/10 bg-theatre-dark/40 hover:border-white/20'
                                        } text-white`}
                                    >
                                      {isSelected && (
                                        <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-theatre-gold text-theatre-grey-deep flex items-center justify-center z-10 shadow-md">
                                          <Check className="w-3 h-3" />
                                        </span>
                                      )}
                                      <div className="flex items-center space-x-3 mb-1.5">
                                        <Gift className="w-4 h-4 text-theatre-gold" />
                                        <h5 className="text-xs font-bold text-white">{decor.name}</h5>
                                      </div>
                                      <div className="flex justify-between items-baseline pt-1">
                                        <span className="text-base font-bold text-theatre-gold">₹{decor.price}</span>
                                        <span className="text-[10px] text-gray-500 font-medium">(GST Inclusive)</span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="p-4 rounded-xl border border-white/10 bg-white/5 text-gray-400 text-xs text-center">
                                No decorations available for this screen.
                              </div>
                            )}
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 3: Celebration Add-ons */}
                {activeStep === 3 && (
                  <div className="space-y-6 max-w-3xl mx-auto w-full">
                    <div className="space-y-1 text-center py-2 border-b border-white/5 pb-4">
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">Step 3: Celebration Add-ons</h3>
                      <p className="text-xs sm:text-sm text-gray-400">Select extra bespoke services to capture and elevate your booking experience.</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
                      {(() => {
                        if (!dbAddons || dbAddons.length === 0) return <div className="col-span-full py-4 text-center text-xs text-gray-400">No add-ons available.</div>;
                        const addonList = dbAddons.map(addon => ({
                          key: getAddonKey(addon.name),
                          name: addon.name,
                          price: `₹${addon.price.toLocaleString('en-IN')}`,
                          icon: getAddonIcon(addon.name),
                          image: addon.image,
                          allowQuantity: addon.allowQuantity
                        }));
                        const totalAddonPages = Math.ceil(addonList.length / addonsPerPage);
                        const paginatedAddons = addonList.slice((addonPage - 1) * addonsPerPage, addonPage * addonsPerPage);
                        return paginatedAddons.map(addon => {
                          const Icon = addon.icon;
                          const isSelected = selectedAddons.includes(addon.key);
                          return (
                            <div
                              key={addon.key}
                              onClick={() => toggleAddon(addon.key)}
                              className={`rounded-xl overflow-hidden border cursor-pointer flex flex-col justify-between transition-all duration-300 relative ${isSelected
                                ? 'border-theatre-gold bg-theatre-gold/5 text-theatre-gold scale-102 shadow-md shadow-theatre-gold/5'
                                : 'border-white/10 bg-theatre-dark/40 text-gray-400 hover:border-white/20'
                                }`}
                            >
                              {isSelected && (
                                <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-theatre-gold text-theatre-grey-deep flex items-center justify-center z-10 shadow-md">
                                  <Check className="w-3 h-3" />
                                </span>
                              )}

                              <div className="h-28 w-full bg-gray-900/60 overflow-hidden relative flex items-center justify-center">
                                {addon.image ? (
                                  <img
                                    src={getImageUrl(addon.image?.path || addon.image)}
                                    alt={addon.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="p-3 bg-white/5 rounded-full text-gray-400">
                                    <Icon className="w-6 h-6" />
                                  </div>
                                )}
                              </div>

                              <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
                                <h4 className="text-xs font-bold text-white line-clamp-2">{addon.name}</h4>
                                <span className="text-[11px] text-theatre-gold font-bold">{addon.price}</span>
                              </div>

                              {isSelected && (
                                <input
                                  type="text"
                                  inputMode={addon.allowQuantity ? "numeric" : "text"}
                                  onClick={(e) => e.stopPropagation()}
                                  value={addonComments[addon.key] || ''}
                                  onChange={(e) => {
                                    let val = e.target.value;
                                    if (addon.allowQuantity) {
                                      val = val.replace(/[^0-9]/g, '');
                                    }
                                    setAddonComments(prev => ({
                                      ...prev,
                                      [addon.key]: val
                                    }));
                                  }}
                                  placeholder={addon.allowQuantity ? "Enter Number (Numeric only)" : "Enter Comment / Note"}
                                  className="w-full bg-theatre-dark/60 text-white px-2.5 py-1.5 border-t border-theatre-gold/30 focus:border-theatre-gold outline-none text-[10px] placeholder:text-gray-500"
                                />
                              )}
                            </div>
                          );
                        });
                      })()}
                    </div>

                    {(() => {
                      const totalItems = dbAddons ? dbAddons.length : 0;
                      const totalAddonPages = Math.ceil(totalItems / addonsPerPage);
                      return totalAddonPages > 1 ? (
                        <div className="flex items-center justify-end space-x-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setAddonPage(prev => Math.max(1, prev - 1))}
                            disabled={addonPage === 1}
                            className="p-1.5 rounded-lg border border-white/10 bg-theatre-dark/40 text-gray-400 hover:text-white disabled:opacity-30 transition-all cursor-pointer"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <span className="text-xs text-gray-400 font-sans px-2">
                            Page {addonPage} of {totalAddonPages}
                          </span>
                          <button
                            type="button"
                            onClick={() => setAddonPage(prev => Math.min(totalAddonPages, prev + 1))}
                            disabled={addonPage === totalAddonPages}
                            className="p-1.5 rounded-lg border border-white/10 bg-theatre-dark/40 text-gray-400 hover:text-white disabled:opacity-30 transition-all cursor-pointer"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      ) : null;
                    })()}

                  </div>
                )}

                {/* STEP 4: Customer Details & Payment */}
                {activeStep === 4 && (
                  <div className="space-y-8 max-w-3xl mx-auto w-full">
                    <div className="space-y-1 text-center py-2 border-b border-white/5 pb-4">
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">Step 4: Customer Details & Payment</h3>
                      <p className="text-xs sm:text-sm text-gray-400">Fill in your contact information, verify OTP, accept terms, and pay advance amount.</p>
                    </div>

                    {/* Customer Info Form */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Name input */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-300 block">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type="text"
                            value={customerInfo.fullName}
                            onChange={(e) => {
                              const cleanedVal = e.target.value.replace(/[0-9]/g, '');
                              setCustomerInfo({ ...customerInfo, fullName: cleanedVal });
                              setStepErrors(prev => ({ ...prev, fullName: null }));
                            }}
                            placeholder="Enter Full Name"
                            className="w-full bg-theatre-dark/60 text-white pl-11 pr-4 py-3 rounded-xl border border-white/10 focus:border-theatre-gold outline-none transition-all duration-300 text-xs placeholder:text-gray-600"
                          />
                        </div>
                        {stepErrors.fullName && (
                          <p className="text-red-400 text-xs flex items-center space-x-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{stepErrors.fullName}</span>
                          </p>
                        )}
                      </div>

                      {/* Email input */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-300 block">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type="email"
                            value={customerInfo.email}
                            onChange={(e) => {
                              setCustomerInfo({ ...customerInfo, email: e.target.value });
                              setStepErrors(prev => ({ ...prev, email: null }));
                            }}
                            placeholder="Enter Email Address"
                            className="w-full bg-theatre-dark/60 text-white pl-11 pr-4 py-3 rounded-xl border border-white/10 focus:border-theatre-gold outline-none transition-all duration-300 text-xs placeholder:text-gray-600"
                          />
                        </div>
                        {stepErrors.email && (
                          <p className="text-red-400 text-xs flex items-center space-x-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{stepErrors.email}</span>
                          </p>
                        )}
                      </div>

                      {/* Phone input with OTP trigger */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-300 block">Mobile Number</label>
                        <div className="relative flex items-center space-x-2">
                          <div className="relative flex-grow">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                              type="tel"
                              maxLength={10}
                              disabled={otpVerified}
                              value={customerInfo.phone}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                setCustomerInfo({ ...customerInfo, phone: val });
                                setStepErrors(prev => ({ ...prev, phone: null }));
                              }}
                              placeholder="Enter Mobile Number"
                              className="w-full bg-theatre-dark/60 text-white pl-11 pr-4 py-3 rounded-xl border border-white/10 focus:border-theatre-gold outline-none transition-all duration-300 text-xs placeholder:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                          </div>
                          {!otpVerified && (
                            <button
                              type="button"
                              onClick={handleSendOtp}
                              disabled={sendingOtp}
                              className="bg-theatre-gold hover:bg-theatre-gold-light text-theatre-grey-deep font-sans text-[11px] font-bold px-3 py-3 rounded-xl shadow-md transition-all duration-300 cursor-pointer disabled:opacity-50 flex-shrink-0"
                            >
                              {sendingOtp ? 'Sending...' : otpSent ? 'Resend' : 'Send OTP'}
                            </button>
                          )}
                        </div>
                        {stepErrors.phone && (
                          <p className="text-red-400 text-xs flex items-center space-x-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{stepErrors.phone}</span>
                          </p>
                        )}
                      </div>

                      {/* OTP verification input code */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-300 block">OTP Code</label>
                        <div className="relative flex items-center space-x-2">
                          <div className="relative flex-grow">
                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                              type="text"
                              maxLength={4}
                              disabled={!otpSent || otpVerified}
                              value={customerInfo.otp}
                              onChange={(e) => setCustomerInfo({ ...customerInfo, otp: e.target.value })}
                              placeholder="Enter 4-Digit OTP"
                              className="w-full bg-theatre-dark/60 text-white pl-11 pr-4 py-3 rounded-xl border border-white/10 focus:border-theatre-gold outline-none transition-all duration-300 text-xs placeholder:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                          </div>
                          {otpSent && !otpVerified && (
                            <button
                              type="button"
                              onClick={handleVerifyOtp}
                              className="bg-green-500 hover:bg-green-600 text-white font-sans text-[11px] font-bold px-3 py-3 rounded-xl shadow-md transition-all duration-300 cursor-pointer flex-shrink-0"
                            >
                              Verify
                            </button>
                          )}
                        </div>

                        {otpSent && !otpVerified && (
                          <p className="text-theatre-gold text-[10px] tracking-wide mt-1 animate-pulse">
                            Simulation OTP code: {generatedOtp}
                          </p>
                        )}
                        {otpError && (
                          <p className="text-red-400 text-xs flex items-center space-x-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{otpError}</span>
                          </p>
                        )}
                        {otpVerified && (
                          <p className="text-green-400 text-xs flex items-center space-x-1 mt-1">
                            <Check className="w-4 h-4" />
                            <span>Mobile verified successfully!</span>
                          </p>
                        )}
                        {stepErrors.otp && !otpVerified && (
                          <p className="text-red-400 text-xs flex items-center space-x-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{stepErrors.otp}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Terms & Conditions Checkbox */}
                    <div className="space-y-2 pt-4 border-t border-white/10">
                      <label className="flex items-start space-x-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={termsAccepted}
                          onChange={(e) => {
                            setTermsAccepted(e.target.checked);
                            if (e.target.checked) setStepErrors(prev => ({ ...prev, terms: null }));
                          }}
                          className="w-5 h-5 rounded border-white/20 text-theatre-gold focus:ring-theatre-gold bg-theatre-dark/60 mt-0.5 cursor-pointer accent-amber-500"
                        />
                        <span className="text-xs text-gray-300 group-hover:text-white transition-colors leading-relaxed">
                          I agree to the{' '}
                          <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="text-theatre-gold underline hover:text-theatre-gold-light font-semibold">
                            Terms & Conditions
                          </a>.
                        </span>
                      </label>
                      {stepErrors.terms && (
                        <p className="text-red-400 text-xs flex items-center space-x-1 pl-8">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{stepErrors.terms}</span>
                        </p>
                      )}
                    </div>

                    {/* Payment Mode Selector & Advance Payment Box */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-white/5">
                      <div className="space-y-3">
                        <label className="text-xs font-semibold text-gray-300 block">Select Payment Mode</label>
                        <div className="space-y-2.5">
                          {[
                            { id: 'upi', name: 'UPI (GPay / PhonePe / Paytm)' },
                            { id: 'netbank', name: 'Net Banking' }
                          ].map(method => {
                            const isSelected = paymentMethod === method.id;
                            return (
                              <div
                                key={method.id}
                                onClick={() => setPaymentMethod(method.id)}
                                className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all duration-300 ${isSelected
                                  ? 'border-theatre-gold bg-theatre-gold/5 text-theatre-gold'
                                  : 'border-white/10 bg-theatre-dark/40 text-gray-400 hover:border-white/20'
                                  }`}
                              >
                                <span className="text-xs font-semibold uppercase tracking-wider">{method.name}</span>
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-theatre-gold text-theatre-gold' : 'border-white/20'
                                  }`}>
                                  {isSelected && <span className="w-2 h-2 bg-theatre-gold rounded-full" />}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="bg-theatre-grey-deep/30 border border-white/5 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400">Total Payable:</span>
                            <span className="text-white font-bold">₹{totalAmount}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs font-bold border-t border-white/5 pt-2">
                            <span className="text-white">Payable Now (Advance):</span>
                            <span className="text-theatre-gold text-base">₹{advancePaymentRequired}</span>
                          </div>
                          <div className="p-3 bg-theatre-gold/5 border border-theatre-gold/20 rounded-xl flex items-start space-x-2">
                            <AlertCircle className="w-4 h-4 text-theatre-gold mt-0.5 flex-shrink-0 animate-pulse" />
                            <p className="text-[11px] text-gray-300 font-normal leading-relaxed">
                              Remaining balance of <span className="text-white font-extrabold">₹{remainingBalance}</span> is payable at the venue on event date.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handlePayment}
                          disabled={isPaying || !otpVerified}
                          className="w-full bg-gradient-to-r from-theatre-gold to-theatre-gold-dark hover:from-theatre-gold-light hover:to-theatre-gold text-theatre-grey-deep font-sans font-bold py-3.5 rounded-xl shadow-lg hover:shadow-theatre-gold/20 flex items-center justify-center space-x-2 text-xs transition-all duration-300 cursor-pointer disabled:opacity-50"
                        >
                          {isPaying ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin text-theatre-grey-deep" />
                              <span>Processing Secure Payment...</span>
                            </>
                          ) : (
                            <>
                              <CreditCard className="w-4 h-4 text-theatre-grey-deep" />
                              <span>Pay ₹{advancePaymentRequired} Advance</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: Booking Confirmation SUCCESS */}
                {activeStep === 5 && (
                  <div className="max-w-2xl mx-auto pt-1 pb-4  text-center space-y-4">
                    <div className="inline-flex p-4 bg-green-500/10 text-green-400 rounded-full border border-green-500/20">
                      <ShieldCheck className="w-10 h-10" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-serif text-3xl font-bold text-white">Booking Confirmed!</h3>
                      <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
                        Your private screening slot has been locked successfully. Check your registered phone number & email address for your ticket validation copy.
                      </p>
                    </div>

                    <div className="bg-theatre-dark/95 border border-white/10 rounded-2xl p-6 relative max-w-md mx-auto shadow-inner text-center">
                      <div className="absolute top-1/2 -left-3.5 w-7 h-7 bg-theatre-grey-deep rounded-full -translate-y-1/2 z-10" />
                      <div className="absolute top-1/2 -right-3.5 w-7 h-7 bg-theatre-grey-deep rounded-full -translate-y-1/2 z-10" />

                      <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/5 text-xs">
                        <div>
                          <span className="text-[10px] text-gray-500 block uppercase font-bold mb-1">BOOKING ID</span>
                          <span className="text-sm text-theatre-gold font-sans font-bold">{bookingId}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-500 block uppercase font-bold mb-1">THEATRE SCREEN</span>
                          <span className="text-sm text-white font-sans font-semibold">{selectedScreen}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 py-4 border-b border-white/5 text-xs">
                        <div>
                          <span className="text-[10px] text-gray-500 block uppercase font-bold mb-1">DATE & TIME</span>
                          <span className="text-sm text-white font-sans font-semibold">{formatDateDisplay(selectedDate)}</span>
                          <span className="text-[10px] text-gray-400 block mt-0.5">{selectedTimeSlot}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-500 block uppercase font-bold mb-1">TOTAL GUESTS</span>
                          <span className="text-sm text-white font-sans font-semibold block">{totalGuests}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 text-xs">
                        <div>
                          <span className="text-[10px] text-gray-500 block uppercase font-bold mb-1">CUSTOMER</span>
                          <span className="text-sm text-white font-sans font-semibold truncate block">{customerInfo.fullName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-500 block uppercase font-bold mb-1">ADVANCE PAID</span>
                          <span className="text-sm text-green-400 font-sans font-bold">₹{advancePaymentRequired}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center pt-4">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-sans font-bold px-8 py-3.5 rounded-xl transition-all duration-300 text-sm cursor-pointer"
                      >
                        Book Another Event Slot
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Stepper Bottom Controls */}
            {activeStep <= 4 && (
              <div className="hidden sm:flex justify-between items-center pt-6 border-t border-white/5 mt-6 relative">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={activeStep === 1}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {activeStep < 4 && (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={isNextDisabled()}
                    className="inline-flex items-center space-x-1.5 bg-theatre-gold hover:bg-theatre-gold-light text-theatre-grey-deep font-sans text-xs font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-theatre-gold/15 transition-all duration-300 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <span>Proceed Next</span>
                    <ChevronRight className="w-4 h-4 text-theatre-grey-deep" />
                  </button>
                )}
              </div>
            )}
            
            {/* Booking Info Notes (wrapped to left column) */}
            {refundPolicyData && refundPolicyData.content && activeStep <= 4 && (
              <div className="mt-8 mb-4">
                <div className="bg-yellow-500/15 backdrop-blur-md border border-yellow-500/50 rounded-2xl p-5 sm:p-6 shadow-[0_0_20px_rgba(234,179,8,0.15)] relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-yellow-500" />
                  <div className="flex items-center gap-2 mb-3 border-b border-yellow-500/20 pb-2">
                     <AlertCircle className="w-5 h-5 text-yellow-500" />
                     <h4 className="text-yellow-500 font-bold uppercase tracking-wider text-sm">Important Booking Notes</h4>
                  </div>
                  <div className="text-xs sm:text-[13px] text-white/90 font-sans leading-relaxed whitespace-pre-line pl-1">
                    {refundPolicyData.content}
                  </div>
                </div>
              </div>
            )}
            
          </div>

          {/* RIGHT PANEL: Live Invoice/Selected Items Summary */}
          {activeStep >= 1 && activeStep <= 4 && (
            <div className="col-span-1 lg:col-span-4 bg-theatre-grey-deep/20 backdrop-blur-md border border-white/5 rounded-3xl p-6 space-y-6 mx-2 sm:mx-0 sticky top-28">
              <h3 className="font-serif text-lg font-bold text-white border-b border-white/5 pb-2">Booking Summary</h3>

              <div className="space-y-3.5 text-xs font-light text-gray-400">
                <div className="flex justify-between items-center text-sm font-semibold text-white">
                  <span>Selected Screen:</span>
                  <span>{selectedScreen ? selectedScreen : 'None'}</span>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="text-white">{formatDateDisplay(selectedDate) || 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="flex-shrink-0">Time Slot:</span>
                    <span className="text-white text-right font-medium pl-4">{selectedTimeSlot || 'Not selected'}</span>
                  </div>

                  {totalGuests > 0 && (
                    <div className="space-y-2 py-2 border-t border-b border-white/5 my-1.5">
                      <div className="flex justify-between font-semibold text-gray-300">
                        <span>Total Guests:</span>
                        <span className="text-white">{totalGuests}</span>
                      </div>
                      {activeCategories.map(cat => {
                        const count = guestCounts[cat._id] || 0;
                        if (count === 0) return null;
                        const isFree = cat.price === 0;
                        const categoryName = cat.name || (cat.to >= 100 ? "Adults" : "Kids");
                        const ageRange = cat.to >= 100
                          ? `Ages ${cat.from}+`
                          : `Ages ${cat.from} to ${cat.to} Yrs`;
                        const rateDesc = isFree ? "(Free)" : `(₹${cat.price} / each)`;

                        return (
                          <div key={cat._id} className="py-1">
                            <div className="flex justify-between items-center text-xs">
                              <div>
                                <span className="font-semibold text-white block">{categoryName}</span>
                                <span className={`text-[10px] block ${isFree ? 'text-emerald-400 font-semibold' : 'text-gray-500'}`}>
                                  {ageRange} {rateDesc}
                                </span>
                              </div>
                              {count > 0 && (
                                <span className="text-white font-bold text-xs">{count}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {eventCategory && (
                    <div className="flex justify-between">
                      <span>Occasion:</span>
                      <span className="text-white">{eventCategory}</span>
                    </div>
                  )}
                </div>

                {selectedScreen && (
                  <div className="space-y-1.5 pt-3 border-t border-white/5">
                    <div className="flex justify-between font-medium text-gray-300">
                      <span>Base Screen Price:</span>
                      <span className="text-white">₹{selectedTimeSlot ? basePrice : 0}</span>
                    </div>
                    {selectedTimeSlot && guestChargeBreakdown.map((breakdown, idx) => (
                      <div key={idx} className="flex justify-between text-gray-400 pl-2">
                        <span>Extra {breakdown.name} ({breakdown.count} * ₹{breakdown.rate}):</span>
                        <span className="text-white">₹{breakdown.charge}</span>
                      </div>
                    ))}
                    {selectedTimeSlot && wantsCake && (
                      <div className="space-y-1 pt-1.5 pl-2 border-t border-white/5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Cakes:</span>
                        {selectedCakes.length > 0 ? (
                          selectedCakes.map((sc, idx) => {
                            const price = cakePrices[sc.flavor] || 800;
                            return (
                              <div key={idx} className="flex flex-col space-y-0.5 text-[11px] text-gray-400 pl-1 font-mono">
                                <div className="flex justify-between">
                                  <span>+ {sc.flavor}:</span>
                                  <span className="text-white">₹{price}</span>
                                </div>
                                {sc.message && (
                                  <div className="text-[9px] text-gray-500 italic pl-3 break-words max-w-xs">
                                    "{sc.message}"
                                  </div>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <div className="flex justify-between text-[11px] text-gray-400 pl-1 font-mono">
                            <span>+ {cakeFlavor}:</span>
                            <span className="text-white">₹{cakePrices[cakeFlavor] || 800}</span>
                          </div>
                        )}
                      </div>
                    )}
                    {selectedTimeSlot && wantsDecor && (
                      <div className="flex justify-between text-gray-400 pl-2">
                        <span>Decoration {autoDecoration?.name ? `(${autoDecoration.name})` : ''}:</span>
                        <span className="text-white">₹{decorCharges}</span>
                      </div>
                    )}

                    {selectedTimeSlot && selectedAddons.length > 0 && (
                      <div className="space-y-1 pt-1.5 pl-2 border-t border-white/5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Add-ons:</span>
                        {selectedAddons.map(key => {
                          const addon = addonsPrices[key];
                          if (!addon) return null;
                          let name = addon.name;

                          const qtyStr = addonQuantities[key];
                          const qty = qtyStr ? (parseInt(qtyStr, 10) || 1) : 1;
                          const itemTotal = addon.price * qty;
                          if (qty > 1) {
                            name = `${name} (Qty: ${qty})`;
                          }
                          return (
                            <div key={key} className="flex flex-col text-[11px] text-gray-400 pl-1 font-mono">
                              <div className="flex justify-between">
                                <span>+ {name}:</span>
                                <span className="text-white">₹{itemTotal}</span>
                              </div>
                              {addonComments[key] && (
                                <div className="text-[9px] text-gray-500 italic pl-3 break-words max-w-xs mt-0.5">
                                  "{addonComments[key]}"
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-dashed border-white/10 pt-4 space-y-2">
                <div className="flex justify-between text-base font-bold text-white border-t border-white/5 pt-2">
                  <span>Total Amount:</span>
                  <span className="text-theatre-gold">₹{selectedTimeSlot ? totalAmount : 0}</span>
                </div>
                <div className="text-xs text-theatre-gold text-center font-bold mt-2 font-sans bg-theatre-gold/10 py-1.5 rounded-lg border border-theatre-gold/30 shadow-md">
                  * All prices are inclusive of GST
                </div>

                {selectedTimeSlot && (
                  <div className="bg-theatre-gold/10 p-3 rounded-xl border border-theatre-gold/25 mt-4 space-y-1 text-center font-sans">
                    <span className="text-[10px] text-gray-400 block uppercase font-bold">Lock Deposit Required</span>
                    <span className="text-lg font-bold text-theatre-gold block">₹{advancePaymentRequired}</span>
                    <span className="text-[9px] text-gray-500 block leading-tight">Payable online to secure slot</span>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>


      </div>

      {/* Mobile-Only Fixed Bottom Controls */}
      {activeStep <= 4 && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#17191d]/95 backdrop-blur-md border-t border-white/10 p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.5)] flex justify-between items-center">
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={activeStep === 1}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {activeStep < 4 && (
            <button
              type="button"
              onClick={handleNextStep}
              disabled={isNextDisabled()}
              className="inline-flex items-center space-x-1.5 bg-theatre-gold hover:bg-theatre-gold-light text-theatre-grey-deep font-sans text-xs font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-theatre-gold/15 transition-all duration-300 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span>Proceed Next</span>
              <ChevronRight className="w-4 h-4 text-theatre-grey-deep" />
            </button>
          )}
        </div>
      )}
    </section>
  );
}
