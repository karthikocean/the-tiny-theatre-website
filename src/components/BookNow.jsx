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
import { verifyCustomer } from '../Api/CustomerApi';
import { createBooking, addPaymentToBooking } from '../Api/booking';
import ShowNotifications from '../helper/showNotification';

export default function BookNow({ selectedEventName, clearSelectedEvent }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Current active step of the wizard (1 to 11)
  const [activeStep, setActiveStep] = useState(1);

  const stepperScrollRef = useRef(null);

  useEffect(() => {
    if (stepperScrollRef.current) {
      const container = stepperScrollRef.current;
      const visibleWidth = container.clientWidth;
      const stepIndex = activeStep - 1; // 0-indexed

      // Calculate center coordinate of the active step inside the 700px content width
      const stepX = 16 + stepIndex * 83.5;

      // Center it inside the container
      const targetScrollLeft = stepX - (visibleWidth / 2);

      container.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: 'smooth'
      });
    }
  }, [activeStep]);

  // Default Date helper
  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Format date from YYYY-MM-DD to DD-MM-YYYY for display
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  // States representing user inputs
  const [selectedScreen, setSelectedScreen] = useState(() => {
    return location.state?.selectedScreen || null;
  }); // 'A' or 'B'
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState(null);

  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    otp: ''
  });

  // OTP Mocking states
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

  // Dynamic guest counts mapped by category ID
  const [guestCounts, setGuestCounts] = useState({});

  const [eventCategory, setEventCategory] = useState(selectedEventName || '');

  // Cake customization
  const [wantsCake, setWantsCake] = useState(false);
  const [cakeFlavor, setCakeFlavor] = useState('Chocolate Truffle');
  const [cakeMessage, setCakeMessage] = useState('');
  const [cakePage, setCakePage] = useState(1);
  const cakesPerPage = 8;

  // Decoration package toggle & optional details
  const [wantsDecor, setWantsDecor] = useState(false);

  // Add-ons checklist & details
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [ledNumberText, setLedNumberText] = useState('');
  const [sashOccasion, setSashOccasion] = useState('Bride to be');
  const [addonPage, setAddonPage] = useState(1);
  const addonsPerPage = 8;

  // Booked slots from localStorage for availability persistence
  const [bookedSlots, setBookedSlots] = useState(() => {
    try {
      const saved = localStorage.getItem('tiny_theatre_booked_slots');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('upi');

  // Loading indicator for payment processing
  const [isPaying, setIsPaying] = useState(false);

  // Random Booking ID for success page
  const [bookingId, setBookingId] = useState('');

  // Auto-sync event category from parent component
  useEffect(() => {
    if (selectedEventName) {
      setEventCategory(selectedEventName);
    }
  }, [selectedEventName]);

  // Validation errors for each step
  const [stepErrors, setStepErrors] = useState({});

  // Dynamic screens fetching
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

      const screenObj = screens.find(s => {
        const code = s.name.toLowerCase().includes('b') ? 'B' : 'A';
        return code === selectedScreen;
      });

      if (!screenObj || !screenObj._id) return;

      try {
        setLoadingSlots(true);
        const res = await getSlots(screenObj._id, selectedDate);
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

    fetchTimeSlots();
  }, [selectedScreen, selectedDate, screens]);

  // Dynamic addons fetching
  const [dbAddons, setDbAddons] = useState([]);
  const [loadingAddons, setLoadingAddons] = useState(true);

  useEffect(() => {
    const fetchAddons = async () => {
      try {
        const res = await getAddons({ type: 'others' });
        if (res && res.status && res.response && res.response.data) {
          const activeAddons = res.response.data.filter(
            (addon) => addon.isActive === 1 && addon.isDelete === 0 && addon.type !== 'cake'
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
        console.error('Error fetching occasions:', err);
      } finally {
        setLoadingOccasions(false);
      }
    };
    fetchOccasions();
  }, []);

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

  // Set default cake selection when cakes load
  useEffect(() => {
    if (dbCakes && dbCakes.length > 0) {
      setCakeFlavor(dbCakes[0].name);
    }
  }, [dbCakes]);

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

  const basePrice = selectedSlotObj ? selectedSlotObj.price : (selectedScreen === 'A' ? 2399 : selectedScreen === 'B' ? 1799 : 0);
  const maxCapacity = selectedScreen === 'A' ? 15 : selectedScreen === 'B' ? 6 : 0;
  const activeCategories = selectedSlotObj?.ageCategories && selectedSlotObj.ageCategories.length > 0
    ? selectedSlotObj.ageCategories
    : [
      { _id: 'default_adults', name: 'Adults', from: 11, to: 100, price: selectedScreen === 'A' ? 450 : 400 },
      { _id: 'default_kids_3_10', name: 'Kids (3 to 10 Years)', from: 4, to: 10, price: selectedScreen === 'A' ? 250 : 200 },
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

  const kids3to10Charges = 0; // Handled dynamically in additionalGuestCharges

  // Setup fallback variables for backward compatibility in display tags
  const adultCategory = activeCategories.find(cat => cat.to >= 100 || cat.from >= 10);
  const guestRate = adultCategory ? adultCategory.price : (selectedScreen === 'A' ? 450 : selectedScreen === 'B' ? 400 : 0);
  const kidsCategory = activeCategories.find(cat => cat.from === 4 && cat.to === 10);
  const kids3to10Rate = kidsCategory ? kidsCategory.price : (selectedScreen === 'A' ? 250 : selectedScreen === 'B' ? 200 : 0);

  // Cake flavor prices
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
  const cakeCharges = wantsCake ? cakePrices[cakeFlavor] || 800 : 0;

  // Decor charges: flat rates inclusive of GST
  const decorCharges = wantsDecor ? (selectedScreen === 'A' ? 900 : 800) : 0;

  // Add-on pricing definitions
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
      const key = getAddonKey(addon.name);
      addonsPrices[key] = {
        name: addon.name,
        price: addon.price
      };
    });
  }

  const addonsCharges = selectedAddons.reduce((sum, key) => sum + (addonsPrices[key]?.price || 0), 0);

  const subtotal = basePrice + additionalGuestCharges + kids3to10Charges + cakeCharges + decorCharges + addonsCharges;
  const gstCharges = 0; // Inclusive of GST
  const totalAmount = subtotal;
  const advancePaymentRequired = 1000;
  const remainingBalance = totalAmount - advancePaymentRequired;

  // Mock OTP handlers
  const handleSendOtp = () => {
    const cleanedPhone = (customerInfo.phone || '').replace(/\D/g, '');
    if (!cleanedPhone || !/^[6-9]\d{9}$/.test(cleanedPhone)) {
      setStepErrors({ phone: 'Please enter a valid 10-digit mobile number.' });
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
    if (customerInfo.otp === generatedOtp) {
      setOtpError('');
      setStepErrors({});
      try {
        const res = await verifyCustomer({
          name: customerInfo.fullName,
          email: customerInfo.email,
          mobileNumber: customerInfo.phone
        });
        if (res.status) {
          setOtpVerified(true);
          ShowNotifications.showAlertNotification("Customer verified successfully", true);
        } else {
          setOtpError("Failed to verify customer details on server.");
        }
      } catch (err) {
        setOtpError("Error connecting to server.");
      }
    } else {
      setOtpError('Invalid OTP code. Please enter the code sent to you.');
    }
  };

  // Next Step Disabled helper
  const isNextDisabled = () => {
    if (activeStep === 1) {
      return !selectedScreen;
    }
    if (activeStep === 2) {
      return !selectedDate || !selectedTimeSlot;
    }
    if (activeStep === 3) {
      const cleanedPhone = (customerInfo.phone || '').replace(/\D/g, '');
      const isPhoneValid = /^[6-9]\d{9}$/.test(cleanedPhone);
      const isEmailValid = /\S+@\S+\.\S+/.test(customerInfo.email);
      const isNameValid = customerInfo.fullName.trim().length > 0;
      return !isNameValid || !isEmailValid || !isPhoneValid || !otpVerified;
    }
    if (activeStep === 4) {
      return totalGuests === 0;
    }
    if (activeStep === 5) {
      return !eventCategory;
    }
    return false;
  };

  // Step Validation logic before proceeding
  const handleNextStep = () => {
    const errors = {};
    if (activeStep === 1 && !selectedScreen) {
      errors.screen = 'Please select a screening hall to continue.';
      setStepErrors(errors);
      return;
    }
    if (activeStep === 2) {
      if (!selectedDate) errors.date = 'Date selection is required.';
      if (!selectedTimeSlot) errors.time = 'Please select a preferred time slot.';
      if (Object.keys(errors).length > 0) {
        setStepErrors(errors);
        return;
      }
    }
    if (activeStep === 3) {
      if (!customerInfo.fullName.trim()) errors.fullName = 'Full Name is required.';
      if (!customerInfo.email.trim() || !/\S+@\S+\.\S+/.test(customerInfo.email)) errors.email = 'Please provide a valid email.';
      const cleanedPhone = (customerInfo.phone || '').replace(/\D/g, '');
      if (!customerInfo.phone.trim()) {
        errors.phone = 'Mobile number is required.';
      } else if (!/^[6-9]\d{9}$/.test(cleanedPhone)) {
        errors.phone = 'Please enter a valid 10-digit mobile number.';
      }
      if (!otpVerified) errors.otp = 'Please verify your phone number via OTP first.';
      if (Object.keys(errors).length > 0) {
        setStepErrors(errors);
        return;
      }
    }
    if (activeStep === 4) {
      if (totalGuests > maxCapacity) {
        errors.guests = `Selected screen capacity is max ${maxCapacity} guests. Please reduce count or select Screen A.`;
        setStepErrors(errors);
        return;
      }
    }

    if (activeStep === 1) {
      if (!selectedDate) {
        setSelectedDate(getTodayDateString());
      }
    }

    setStepErrors({});
    setActiveStep(prev => prev + 1);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  };

  const handlePrevStep = () => {
    setStepErrors({});
    setActiveStep(prev => Math.max(1, prev - 1));
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  };

  // Mock Payment Action
  const handlePayment = async () => {
    setIsPaying(true);

    try {
      // Find the screen ID and slot ID based on selected strings
      const screenObj = screens.find(s => {
        const code = s.name.toLowerCase().includes('b') ? 'B' : 'A';
        return code === selectedScreen;
      });

      const occasionObj = dbOccasions.find(o => o.name === eventCategory);
      // Construct add-on IDs
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
      const selectedCakeObj = wantsCake ? dbCakes.find(c => c.name === cakeFlavor) : null;
      const selectedCakeId = selectedCakeObj ? selectedCakeObj._id : undefined;

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
        cakeComment: wantsCake ? cakeMessage : undefined,
        selectedCakeId: selectedCakeId ? [selectedCakeId] : [],
        decoration: wantsDecor,
        addons: addonIds,
        totalAmount: totalAmount
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

        setActiveStep(10);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#F4C430', '#14C299', '#ffffff']
        });
      } else {
        ShowNotifications.showAlertNotification("Failed to create booking. Please try again.", false);
      }
    } catch (err) {
      console.error(err);
      ShowNotifications.showAlertNotification("An error occurred during booking.", false);
    } finally {
      setIsPaying(false);
    }
  };

  // Reset Booking Form
  const handleReset = () => {
    setActiveStep(1);
    setSelectedScreen(null);
    setSelectedDate(getTodayDateString());
    setSelectedTimeSlot('');
    setSelectedSlotId(null);
    setCustomerInfo({ fullName: '', email: '', phone: '', otp: '' });
    setOtpSent(false);
    setOtpVerified(false);
    setGuestCounts({});
    setWantsCake(false);
    setCakeFlavor('Chocolate Truffle');
    setCakeMessage('');
    setWantsDecor(false);
    setSelectedAddons([]);
    setLedNumberText('');
    setSashOccasion('Bride to be');
    setStepErrors({});
    if (clearSelectedEvent) {
      clearSelectedEvent();
    }
  };

  // Toggle addons selections
  const toggleAddon = (addonKey) => {
    if (selectedAddons.includes(addonKey)) {
      setSelectedAddons(selectedAddons.filter(k => k !== addonKey));
    } else {
      setSelectedAddons([...selectedAddons, addonKey]);
    }
  };

  const stepNames = [
    'Screen', 'Slot', 'Details', 'Guests', 'Occasion',
    'Cake', 'Decor', 'Add-ons', 'Payment'
  ];

  return (
    <section id="book-now" className={`relative bg-theatre-dark/95 overflow-hidden min-h-screen transition-all duration-500 ${activeStep === 10 ? 'py-6 md:py-8' : 'py-16'
      }`}>
      {/* Visual backgrounds */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-theatre-grey/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-theatre-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[85rem] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">

        {/* Section Header */}


        {activeStep <= 9 && (
          /* horizontal Progress Steps Bar */
          <div ref={stepperScrollRef} className="w-full max-w-5xl mx-auto mb-12 overflow-x-auto pb-4 scrollbar-thin">
            <div className="flex items-center justify-between min-w-[700px] px-4">
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
                      <span className={`text-[10px] mt-2 font-medium tracking-wide uppercase transition-colors duration-300 ${isActive ? 'text-theatre-gold' : 'text-gray-500'
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start max-w-6xl mx-auto">

          {/* LEFT PANEL: Wizard Steps (Col Span 8 on large, Full on mobile) */}
          <div className={`col-span-1 bg-theatre-grey-deep/20 backdrop-blur-md border border-white/5 rounded-3xl flex flex-col justify-between transition-all duration-300 ${activeStep === 1 || activeStep === 10
              ? 'lg:col-span-12'
              : 'lg:col-span-8'
            } ${activeStep === 10
              ? 'p-4 sm:p-6 pt-2 sm:pt-2 min-h-0'
              : `p-6 sm:p-8 ${(activeStep === 6 && !wantsCake) || activeStep === 7
                ? 'min-h-[300px]'
                : 'min-h-[480px]'
              }`
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
                {/* STEP 1: Select Screen */}
                {activeStep === 1 && (
                  <div className="space-y-6 max-w-2xl mx-auto w-full">
                    <div className="space-y-1 text-center">
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">Step 1: Select Screen</h3>
                      <p className="text-xs sm:text-sm text-gray-400">Choose between our premium private theatre halls based on seating capacity.</p>
                    </div>

                    {stepErrors.screen && (
                      <div className="p-3.5 bg-red-950/30 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center space-x-2">
                        <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
                        <span>{stepErrors.screen}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                      {((screens && screens.length > 0) ? screens : [
                        {
                          _id: 'default-a',
                          name: 'Screen A',
                          description: 'Ideal for large group movie nights, reunions, and grand parties.',
                          capacity: 15,
                          image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80'
                        },
                        {
                          _id: 'default-b',
                          name: 'Screen B',
                          description: 'Perfect for intimate date nights, couples, and small family gatherings.',
                          capacity: 6,
                          image: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=400&q=80'
                        }
                      ]).map((screen) => {
                        const screenCode = screen.name.toLowerCase().includes('b') ? 'B' : 'A';
                        const isSelected = selectedScreen === screenCode;

                        const pricingInfo = screenCode === 'A' ? {

                          basePrice: '₹2,399',
                          extraGuest: '₹450 / each',
                          kids: '₹250 / each',
                          fallbackImg: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80'
                        } : {

                          basePrice: '₹1,799',
                          extraGuest: '₹400 / each',
                          kids: '₹200 / each',
                          fallbackImg: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=400&q=80'
                        };

                        return (
                          <div
                            key={screen._id || screenCode}
                            onClick={() => { setSelectedScreen(screenCode); setStepErrors({}); }}
                            className={`rounded-2xl overflow-hidden bg-theatre-dark/40 border cursor-pointer group transition-all duration-300 flex flex-col ${isSelected
                              ? 'border-theatre-gold shadow-lg shadow-theatre-gold/15 scale-[1.01]'
                              : 'border-white/10 hover:border-white/20'
                              }`}
                          >
                            <div className="relative h-56 sm:h-64 overflow-hidden bg-gray-900">
                              <img
                                src={typeof screen.image === 'string' && screen.image.startsWith('http') ? screen.image : getImageUrl(screen.image?.path || screen.image)}
                                alt={`${screen.name} ${pricingInfo.badge}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = pricingInfo.fallbackImg;
                                }}
                              />
                              {/* <span className="absolute top-3 left-3 px-3 py-1 bg-theatre-gold text-theatre-grey-deep font-sans text-[10px] font-black uppercase rounded-full">
                                {pricingInfo.badge}
                              </span>                             */}
                            </div>
                            <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                              <div className="space-y-1.5">
                                <h4 className="text-base sm:text-lg font-serif font-bold text-white">{screen.name}</h4>
                                <p className="text-xs text-gray-400 font-light leading-relaxed">
                                  {screen.description}
                                </p>
                              </div>
                              <div className="space-y-2 border-t border-white/5 pt-3">
                                <div className="flex justify-between items-baseline text-xs">
                                  <span className="text-gray-500 mr-2">Capacity:</span>
                                  <span className="text-white font-semibold whitespace-nowrap text-right">Upto {screen.capacity} Members</span>
                                </div>
                              </div>

                              <button
                                className={`w-full py-2.5 rounded-xl font-sans text-xs font-bold transition-all duration-300 ${isSelected
                                  ? 'bg-theatre-gold text-theatre-grey-deep shadow-md'
                                  : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                                  }`}
                              >
                                {isSelected ? 'Selected' : 'Select Screen'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 2: Choose Date & Time Slot */}
                {activeStep === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-xl font-serif font-bold text-white">Step 2: Choose Date & Time Slot</h3>
                      <p className="text-xs sm:text-sm text-gray-400">Select an Available date and preferred private screening time window.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                      {/* Date Picker */}
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-300 block">Select Date</label>
                        <div className="relative">
                          <input
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                            value={selectedDate}
                            onChange={(e) => { setSelectedDate(e.target.value); setStepErrors({}); }}
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

                        {selectedScreen && selectedTimeSlot && (
                          <div className="hidden md:block mt-4 rounded-2xl overflow-hidden border border-white/10 bg-theatre-grey-deep/15 backdrop-blur-md">
                            {/* Base Price Header Bar */}
                            <div className="flex items-center justify-between px-5 py-4 bg-white/[0.03] border-b border-white/10">
                              <div>
                                <span className="text-xs uppercase font-bold tracking-wider text-gray-300 block">Base Price</span>
                                <span className="text-[10px] text-gray-400 font-medium mt-0.5 block">Covers up to 4 members</span>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold text-theatre-gold">₹{basePrice}</div>
                                <div className="text-[9px] text-gray-500 font-medium mt-0.5">(Inc. GST)</div>
                              </div>
                            </div>

                            <div className="p-5 space-y-4">
                              {/* Divider Title */}
                              <div className="flex items-center text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                                <div className="flex-grow h-px bg-white/10"></div>
                                <span className="px-0">Additional Guest Charges (Above 4 Members)</span>
                                <div className="flex-grow h-px bg-white/10"></div>
                              </div>

                              {/* Clean list with horizontal dividers */}
                              <div className="border border-white/10 rounded-xl overflow-hidden divide-y divide-white/10 bg-white/[0.01]">
                                {[...activeCategories].sort((a, b) => a.from - b.from).map((category) => {
                                  const isFree = category.price === 0;
                                  const isAdult = category.to >= 100 || category.from >= 10;

                                  const ageRangeLabel = isAdult
                                    ? `${category.from}+ Years`
                                    : `${category.from} – ${category.to} Years`;

                                  const rateText = isFree ? "FREE" : `₹${category.price} / each`;

                                  return (
                                    <div key={category._id} className="flex text-xs items-center justify-between px-5 py-3">
                                      {/* Left cell (Age category range) */}
                                      <span className="text-gray-300 font-semibold">{ageRangeLabel}</span>

                                      {/* Right cell (Rate / Pricing details) */}
                                      <div className="text-right flex items-center space-x-2">
                                        <span className={`font-bold ${isFree ? 'text-emerald-400' : 'text-white'}`}>
                                          {rateText}
                                        </span>
                                        <span className="text-[9px] text-gray-500 font-medium">(Inc. GST)</span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Bottom Warning */}
                              <div className="bg-theatre-gold/5 border border-theatre-gold/15 rounded-xl p-2.5 text-center">
                                <p className="text-[11px] text-theatre-gold font-sans font-medium">
                                  All prices shown are final and inclusive of GST.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Time Slots */}
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-300 block">Available Slots</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {loadingSlots ? (
                            <div className="col-span-full py-4 text-center text-sm text-gray-400">Loading slots...</div>
                          ) : (availableSlots.length > 0 ? availableSlots : [
                            { slotName: 'Morning Show', startTime: '9:00 AM', endTime: '12 PM' },
                            { slotName: 'Afternoon Show', startTime: '12:30 PM', endTime: '3:30 PM' },
                            { slotName: 'Evening Show', startTime: '4:00 PM', endTime: '7:00 PM' },
                            { slotName: 'Night Show', startTime: '7:30 PM', endTime: '10:30 PM' },
                            { slotName: 'Late Night Show', startTime: '11:00 PM', endTime: '2:00 AM' }
                          ]).map(slotItem => {
                            const isApiSlot = !!slotItem._id;
                            const formatTime = (t) => {
                              if (!t) return '';
                              const d = new Date(t);
                              if (isNaN(d.getTime())) return t;
                              let h = d.getUTCHours();
                              const m = String(d.getUTCMinutes()).padStart(2, '0');
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
                              b.screen === selectedScreen &&
                              b.date === selectedDate &&
                              b.slot === slotLabel
                            );

                            return (
                              <button
                                key={isApiSlot ? slotItem._id : slotLabel}
                                onClick={() => {
                                  if (!isBooked) {
                                    setSelectedTimeSlot(slotLabel);
                                    setSelectedSlotId(isApiSlot ? slotItem._id : null);
                                    setStepErrors({});
                                  }
                                }}
                                disabled={isBooked}
                                className={`py-3 px-4 rounded-xl text-left border transition-all duration-300 text-xs font-sans ${isSelected
                                  ? 'border-theatre-gold bg-theatre-gold/10 text-theatre-gold shadow-md'
                                  : isBooked
                                    ? 'border-red-500/25 bg-red-950/15 text-gray-500 cursor-not-allowed opacity-50'
                                    : 'border-white/10 bg-theatre-dark/40 text-gray-300 hover:border-white/20'
                                  }`}
                              >
                                <div className="font-bold mb-1">{slotLabel}</div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-widest flex items-center justify-between">
                                  {isApiSlot && slotItem.price != null ? (
                                    <span className="text-theatre-gold font-bold normal-case text-xs">₹{slotItem.price}</span>
                                  ) : (
                                    <span>Slot Timing</span>
                                  )}
                                  {isBooked ? (
                                    <span className="text-red-500 font-semibold capitalize">Booked</span>
                                  ) : (
                                    <span className="text-green-500 font-semibold capitalize">Available</span>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        {stepErrors.time && (
                          <p className="text-red-400 text-xs flex items-center space-x-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{stepErrors.time}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {selectedDate && selectedTimeSlot && (
                      <div className="space-y-4 mt-4">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-theatre-gold/10 border border-theatre-gold/20 rounded-xl flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3 text-sm text-gray-300">
                            <CalendarIcon className="w-5 h-5 text-theatre-gold" />
                            <div>
                              <span className="font-semibold text-white block">Selected Slot Summary</span>
                              <span className="text-xs">{formatDateDisplay(selectedDate)} @ {selectedTimeSlot}</span>
                            </div>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 bg-green-500/25 border border-green-500/30 text-green-400 rounded-full font-bold uppercase tracking-wider">
                            Reserved
                          </span>
                        </motion.div>

                        {/* Mobile-only Base Price & Additional Guest Charges Card */}
                        <div className="md:hidden rounded-2xl overflow-hidden border border-white/10 bg-theatre-grey-deep/15 backdrop-blur-md">
                          {/* Base Price Header Bar */}
                          <div className="flex items-center justify-between px-5 py-4 bg-white/[0.03] border-b border-white/10">
                            <div>
                              <span className="text-xs uppercase font-bold tracking-wider text-gray-300 block">Base Price</span>
                              <span className="text-[10px] text-gray-400 font-medium mt-0.5 block">Covers up to 4 members</span>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-theatre-gold">₹{basePrice}</div>
                              <div className="text-[9px] text-gray-500 font-medium mt-0.5">(Inc. GST)</div>
                            </div>
                          </div>

                          <div className="p-5 space-y-4">
                            {/* Divider Title */}
                            <div className="flex items-center text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                              <div className="flex-grow h-px bg-white/10"></div>
                              <span className="px-0">Additional Guest Charges (Above 4 Members)</span>
                              <div className="flex-grow h-px bg-white/10"></div>
                            </div>

                            {/* Clean list with horizontal dividers */}
                            <div className="border border-white/10 rounded-xl overflow-hidden divide-y divide-white/10 bg-white/[0.01]">
                              {[...activeCategories].sort((a, b) => a.from - b.from).map((category) => {
                                const isFree = category.price === 0;
                                const isAdult = category.to >= 100 || category.from >= 10;

                                const ageRangeLabel = isAdult
                                  ? `${category.from}+ Years`
                                  : `${category.from} – ${category.to} Years`;

                                const rateText = isFree ? "FREE" : `₹${category.price} / each`;

                                return (
                                  <div key={category._id} className="flex text-xs items-center justify-between px-5 py-3">
                                    {/* Left cell (Age category range) */}
                                    <span className="text-gray-300 font-semibold">{ageRangeLabel}</span>

                                    {/* Right cell (Rate / Pricing details) */}
                                    <div className="text-right flex items-center space-x-2">
                                      <span className={`font-bold ${isFree ? 'text-emerald-400' : 'text-white'}`}>
                                        {rateText}
                                      </span>
                                      <span className="text-[9px] text-gray-500 font-medium">(Inc. GST)</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Bottom Warning */}
                            <div className="bg-theatre-gold/5 border border-theatre-gold/15 rounded-xl p-2.5 text-center">
                              <p className="text-[11px] text-theatre-gold font-sans font-medium">
                                All prices shown are final and inclusive of GST.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 3: Customer Information */}
                {activeStep === 3 && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-xl font-serif font-bold text-white">Step 3: Customer Information</h3>
                      <p className="text-xs sm:text-sm text-gray-400">Fill in your contact details and verify your phone number via SMS OTP code.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                      {/* Name input */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-300 block">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                          <input
                            type="text"
                            value={customerInfo.fullName}
                            onChange={(e) => {
                              setCustomerInfo({ ...customerInfo, fullName: e.target.value });
                              setStepErrors(prev => ({ ...prev, fullName: null }));
                            }}
                            placeholder="Enter Full Name"
                            className="w-full bg-theatre-dark/60 text-white pl-11 pr-4 py-3.5 rounded-xl border border-white/10 focus:border-theatre-gold outline-none transition-all duration-300 text-sm placeholder:text-gray-600"
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
                        <label className="text-sm font-semibold text-gray-300 block">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                          <input
                            type="email"
                            value={customerInfo.email}
                            onChange={(e) => {
                              setCustomerInfo({ ...customerInfo, email: e.target.value });
                              setStepErrors(prev => ({ ...prev, email: null }));
                            }}
                            placeholder="Enter Email Address"
                            className="w-full bg-theatre-dark/60 text-white pl-11 pr-4 py-3.5 rounded-xl border border-white/10 focus:border-theatre-gold outline-none transition-all duration-300 text-sm placeholder:text-gray-600"
                          />
                        </div>
                        {stepErrors.email && (
                          <p className="text-red-400 text-xs flex items-center space-x-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{stepErrors.email}</span>
                          </p>
                        )}
                      </div>

                      {/* Phone input with OTP verification trigger */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-300 block">Mobile Number</label>
                        <div className="relative flex items-center space-x-3">
                          <div className="relative flex-grow">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
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
                              className="w-full bg-theatre-dark/60 text-white pl-11 pr-4 py-3.5 rounded-xl border border-white/10 focus:border-theatre-gold outline-none transition-all duration-300 text-sm placeholder:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                          </div>
                          {!otpVerified && (
                            <button
                              type="button"
                              onClick={handleSendOtp}
                              disabled={sendingOtp}
                              className="bg-theatre-gold hover:bg-theatre-gold-light text-theatre-grey-deep font-sans text-[11px] font-bold px-3.5 py-2.5 rounded-lg shadow-md transition-all duration-300 cursor-pointer disabled:opacity-50 flex-shrink-0"
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
                        <label className="text-sm font-semibold text-gray-300 block">OTP Code</label>
                        <div className="relative flex items-center space-x-3">
                          <div className="relative flex-grow">
                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              maxLength={4}
                              disabled={!otpSent || otpVerified}
                              value={customerInfo.otp}
                              onChange={(e) => setCustomerInfo({ ...customerInfo, otp: e.target.value.replace(/\D/g, '') })}
                              placeholder="Enter 4-Digit OTP"
                              className="w-full bg-theatre-dark/60 text-white pl-11 pr-4 py-3.5 rounded-xl border border-white/10 focus:border-theatre-gold outline-none transition-all duration-300 text-sm placeholder:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                          </div>
                          {otpSent && !otpVerified && (
                            <button
                              type="button"
                              onClick={handleVerifyOtp}
                              className="bg-green-500 hover:bg-green-600 text-white font-sans text-[11px] font-bold px-3.5 py-2.5 rounded-lg shadow-md transition-all duration-300 cursor-pointer flex-shrink-0"
                            >
                              Verify Code
                            </button>
                          )}
                        </div>

                        {otpSent && !otpVerified && (
                          <p className="text-theatre-gold text-xs tracking-wide mt-2 font-sans font-bold flex items-center space-x-1.5 bg-theatre-gold/10 border border-theatre-gold/25 p-2.5 rounded-xl max-w-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-theatre-gold animate-ping"></span>
                            <span>Simulated OTP Code: <strong className="text-white bg-theatre-gold/25 px-1.5 py-0.5 rounded font-mono text-sm tracking-widest ml-1">{generatedOtp}</strong></span>
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
                  </div>
                )}

                {/* STEP 4: Number of People */}
                {activeStep === 4 && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-xl font-serif font-bold text-white">Step 4: Number of People</h3>
                      <p className="text-xs sm:text-sm text-gray-400">Specify guest counts. Base booking covers up to 4 adults; additional adults and kids are charged according to screen rules.</p>
                    </div>

                    <div className="max-w-md space-y-6 pt-2">
                      {activeCategories.map((category) => {
                        const count = guestCounts[category._id] || 0;
                        const isFree = category.price === 0;

                        // Create clean descriptive labels
                        const ageLabel = category.to >= 100
                          ? `Ages ${category.from} and above`
                          : `Ages ${category.from} to ${category.to} Years`;

                        const rateDesc = isFree ? "Free" : `₹${category.price} / each`;

                        return (
                          <div key={category._id} className="flex items-center justify-between bg-theatre-dark/40 p-4 border border-white/5 rounded-2xl">
                            <div className="space-y-0.5">
                              <span className="text-sm font-semibold text-white block">
                                {category.name || (category.to >= 100 ? "Adults" : `Kids`)}
                              </span>
                              <span className={`text-xs ${isFree ? 'text-green-500 font-bold' : 'text-gray-500'}`}>
                                {ageLabel} ({rateDesc})
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0 ml-4">
                              <button
                                type="button"
                                onClick={() => handleUpdateGuestCount(category._id, Math.max(0, count - 1))}
                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center font-bold text-sm sm:text-lg cursor-pointer"
                              >
                                -
                              </button>
                              <span className="font-sans font-bold text-sm sm:text-base w-5 sm:w-6 text-center text-white">{count}</span>
                              <button
                                type="button"
                                onClick={() => handleUpdateGuestCount(category._id, count + 1)}
                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center font-bold text-sm sm:text-lg cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {/* Capacity limit details */}
                      <div className="p-4 bg-theatre-grey-deep/30 rounded-2xl border border-white/5 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Total Selected Guests:</span>
                          <span className="text-white font-bold">{totalGuests} Members</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Screen Maximum Capacity:</span>
                          <span className="text-theatre-gold font-bold">{maxCapacity} Members max</span>
                        </div>
                      </div>

                      {stepErrors.guests && (
                        <div className="p-3.5 bg-red-950/30 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center space-x-2">
                          <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
                          <span>{stepErrors.guests}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 5: Choose Occasions */}
                {activeStep === 5 && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-xl font-serif font-bold text-white">Step 5: Choose Occasions</h3>
                      <p className="text-xs sm:text-sm text-gray-400">Tell us what special occasion you are celebrating to customize your experience.</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 pt-2">
                      {((dbOccasions && dbOccasions.length > 0)
                        ? dbOccasions.map(cat => ({
                          name: cat.name,
                          image: cat.image ? getImageUrl(cat.image) : '/movie.png',
                          fallback: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=400&q=80'
                        }))
                        : [
                          { name: 'Movie Watching', image: '/movie.png', fallback: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=400&q=80' },
                          { name: 'Birthday', image: '/birthday.png', fallback: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=400&q=80' },
                          { name: 'Anniversary', image: '/anniversary.png', fallback: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=400&q=80' },
                          { name: 'Romantic Date', image: '/romantic date.png', fallback: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=400&q=80' },
                          { name: 'Proposal', image: '/proposal.png', fallback: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=400&q=80' },
                          { name: 'Bride/Groom to be', image: '/team.png', fallback: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80' },
                          { name: 'Farewell', image: '/team.png', fallback: 'https://images.unsplash.com/photo-1517263904008-797480d25147?auto=format&fit=crop&w=400&q=80' },
                          { name: 'Baby shower', image: '/family.png', fallback: 'https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&w=400&q=80' },
                          { name: 'Kitty party', image: '/team.png', fallback: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80' },
                          { name: 'Get together', image: '/family.png', fallback: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=400&q=80' }
                        ]
                      ).map(cat => {
                        const isSelected = eventCategory === cat.name;
                        return (
                          <div
                            key={cat.name}
                            onClick={() => setEventCategory(cat.name)}
                            className="flex flex-col items-center cursor-pointer group select-none"
                          >
                            {/* Image Container (h-36 size, no golden outline, clean white/gray borders) */}
                            <div className={`relative w-full h-36 rounded-2xl overflow-hidden transition-all duration-300 border bg-theatre-dark/40 ${isSelected
                              ? 'border-white/40 shadow-lg shadow-white/5'
                              : 'border-white/10 hover:border-white/20'
                              }`}>
                              <img
                                src={cat.image}
                                alt={cat.name}
                                className={`w-full h-full object-cover transition-transform duration-500 ${isSelected ? 'scale-105' : 'group-hover:scale-105'
                                  }`}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = cat.fallback;
                                }}
                              />
                            </div>

                            {/* Occasion text underneath - fixed height to prevent layout shifts */}
                            <span className={`mt-2.5 text-[10px] font-sans font-bold uppercase tracking-wider text-center h-8 flex items-center justify-center transition-colors duration-300 ${isSelected ? 'text-theatre-gold font-extrabold' : 'text-gray-400 group-hover:text-white'
                              }`}>
                              {cat.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 6: Cake Selection */}
                {activeStep === 6 && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-xl font-serif font-bold text-white">Step 6: Cake Selection (Optional)</h3>
                      <p className="text-xs sm:text-sm text-gray-400">Would you like us to arrange a fresh celebration cake for your slot?</p>
                    </div>

                    <div className="space-y-6 pt-2">
                      {/* Yes/No selection toggle */}
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => setWantsCake(true)}
                          className={`px-6 py-3 rounded-xl border text-xs font-sans font-bold tracking-wider transition-all duration-300 cursor-pointer ${wantsCake
                            ? 'bg-theatre-gold border-theatre-gold text-theatre-grey-deep'
                            : 'bg-white/5 border-white/10 text-gray-300'
                            }`}
                        >
                          Yes, Include Cake
                        </button>
                        <button
                          onClick={() => setWantsCake(false)}
                          className={`px-6 py-3 rounded-xl border text-xs font-sans font-bold tracking-wider transition-all duration-300 cursor-pointer ${!wantsCake
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
                          className="space-y-6 pt-2"
                        >
                          {loadingCakes ? (
                            <div className="flex items-center space-x-2 text-xs text-gray-400 py-6 justify-center">
                              <RefreshCw className="w-4.5 h-4.5 animate-spin text-theatre-gold" />
                              <span>Loading fresh cakes list...</span>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {(() => {
                                  const cakeList = (dbCakes && dbCakes.length > 0)
                                    ? dbCakes.map(cake => ({
                                      flavor: cake.name,
                                      price: `₹${cake.price.toLocaleString('en-IN')}`,
                                      img: getImageUrl(cake.image?.path || cake.image)
                                    }))
                                    : [
                                      { flavor: 'Chocolate Truffle', price: '₹800', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=80' },
                                      { flavor: 'Red Velvet', price: '₹900', img: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=300&q=80' },
                                      { flavor: 'Butterscotch', price: '₹800', img: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=300&q=80' },
                                      { flavor: 'Black Forest', price: '₹750', img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=300&q=80' }
                                    ];
                                  const totalCakePages = Math.ceil(cakeList.length / cakesPerPage);
                                  const paginatedCakes = cakeList.slice((cakePage - 1) * cakesPerPage, cakePage * cakesPerPage);
                                  return paginatedCakes.map(cake => {
                                    const isSelected = cakeFlavor === cake.flavor;
                                    return (
                                      <div
                                        key={cake.flavor}
                                        onClick={() => setCakeFlavor(cake.flavor)}
                                        className={`rounded-xl overflow-hidden border cursor-pointer bg-theatre-dark/40 transition-all duration-300 ${isSelected
                                          ? 'border-theatre-gold shadow-md shadow-theatre-gold/10 scale-102'
                                          : 'border-white/10 hover:border-white/20'
                                          }`}
                                      >
                                        <div className="h-28 sm:h-32 bg-gray-900 overflow-hidden">
                                          <img src={cake.img} alt={cake.flavor} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="pt-2 pb-2 px-3 text-center space-y-0.5">
                                          <h4 className="text-xs font-bold text-white truncate">{cake.flavor}</h4>
                                          <span className="text-xs text-theatre-gold font-bold">{cake.price}</span>
                                        </div>
                                      </div>
                                    );
                                  });
                                })()}
                              </div>

                              {/* Cake Pagination Control */}
                              {(() => {
                                const totalItems = (dbCakes && dbCakes.length > 0) ? dbCakes.length : 4;
                                const totalCakePages = Math.ceil(totalItems / cakesPerPage);
                                return totalCakePages > 1 ? (
                                  <div className="flex items-center justify-end space-x-2 pt-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setCakePage(prev => Math.max(1, prev - 1));
                                        setTimeout(() => {
                                          window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }, 50);
                                      }}
                                      disabled={cakePage === 1}
                                      className="p-2 rounded-lg border border-white/10 bg-theatre-dark/40 text-gray-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 cursor-pointer"
                                    >
                                      <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <span className="text-xs text-gray-400 font-sans px-2">
                                      Page {cakePage} of {totalCakePages}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setCakePage(prev => Math.min(totalCakePages, prev + 1));
                                        setTimeout(() => {
                                          window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }, 50);
                                      }}
                                      disabled={cakePage === totalCakePages}
                                      className="p-2 rounded-lg border border-white/10 bg-theatre-dark/40 text-gray-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 cursor-pointer"
                                    >
                                      <ChevronRight className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : null;
                              })()}
                            </div>
                          )}

                          {/* Message on Cake input */}
                          <div className="space-y-2 mt-4 max-w-sm">
                            <label className="text-xs font-semibold text-gray-300 block">Message on Cake (Optional - Max 30 Characters)</label>
                            <input
                              type="text"
                              maxLength={30}
                              value={cakeMessage}
                              onChange={(e) => setCakeMessage(e.target.value)}
                              placeholder="E.g., Happy Birthday John"
                              className="w-full bg-theatre-dark/60 text-white px-4 py-2.5 rounded-xl border border-white/10 focus:border-theatre-gold outline-none text-xs transition-all duration-300 placeholder:text-gray-600"
                            />
                            <div className="text-right text-[10px] text-gray-500">
                              {cakeMessage.length}/30 characters
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 7: Decorations */}
                {activeStep === 7 && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-xl font-serif font-bold text-white">Step 7: Decoration Package (Optional)</h3>
                      <p className="text-xs sm:text-sm text-gray-400">Would you like us to decorate the private screening room for your celebration?</p>
                    </div>

                    <div className="space-y-6 pt-2">
                      {/* Yes/No selection toggle */}
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => setWantsDecor(true)}
                          className={`px-6 py-3 rounded-xl border text-xs font-sans font-bold tracking-wider transition-all duration-300 cursor-pointer ${wantsDecor
                            ? 'bg-theatre-gold border-theatre-gold text-theatre-grey-deep'
                            : 'bg-white/5 border-white/10 text-gray-300'
                            }`}
                        >
                          Yes, Include Decor
                        </button>
                        <button
                          onClick={() => setWantsDecor(false)}
                          className={`px-6 py-3 rounded-xl border text-xs font-sans font-bold tracking-wider transition-all duration-300 cursor-pointer ${!wantsDecor
                            ? 'bg-theatre-gold border-theatre-gold text-theatre-grey-deep'
                            : 'bg-white/5 border-white/10 text-gray-300'
                            }`}
                        >
                          No, Skip Decor
                        </button>
                      </div>


                    </div>
                  </div>
                )}

                {/* STEP 8: Add-ons */}
                {activeStep === 8 && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-xl font-serif font-bold text-white">Step 8: Celebration Add-ons</h3>
                      <p className="text-xs sm:text-sm text-gray-400">Select extra bespoke services to capture and elevate your booking.</p>
                    </div>

                    <div className="space-y-6 w-full">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
                        {(() => {
                          const addonList = (dbAddons && dbAddons.length > 0)
                            ? dbAddons.map(addon => ({
                              key: getAddonKey(addon.name),
                              name: addon.name,
                              price: `₹${addon.price.toLocaleString('en-IN')}`,
                              icon: getAddonIcon(addon.name),
                              image: addon.image
                            }))
                            : [
                              { key: 'photography', name: 'Professional Photography', price: '₹1,500', icon: Camera },
                              { key: 'videography', name: 'Cinematic Videography', price: '₹2,500', icon: Camera },
                              { key: 'speaker', name: 'Bluetooth Speaker', price: '₹300', icon: Volume2 },
                              { key: 'lighting', name: 'Special Lighting', price: '₹500', icon: Lightbulb },
                              { key: 'message', name: 'Personalized Screen Msg', price: '₹400', icon: MessageSquare },
                              { key: 'fog_entry', name: 'Fog Entry', price: '₹1,000', icon: Wind },
                              { key: 'led_numbers', name: 'LED Numbers', price: '₹300', icon: Lightbulb },
                              { key: 'candle_path', name: 'Candle Path', price: '₹400', icon: Sparkles },
                              { key: 'event_sash', name: 'Event Sash', price: '₹150', icon: Star },
                              { key: 'crown', name: 'Crown', price: '₹150', icon: Star },
                              { key: 'karaoke', name: 'Karaoke Setup', price: '₹800', icon: Mic }
                            ];
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
                                {/* Selected Badge */}
                                {isSelected && (
                                  <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-theatre-gold text-theatre-grey-deep flex items-center justify-center z-10 shadow-md">
                                    <Check className="w-3 h-3" />
                                  </span>
                                )}

                                {/* Top Image or Fallback Icon area */}
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

                                {/* Bottom Content details */}
                                <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
                                  <h4 className="text-xs font-bold text-white line-clamp-2">{addon.name}</h4>
                                  <span className="text-[11px] text-theatre-gold font-bold">{addon.price}</span>
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>

                      {/* Addon Pagination Control */}
                      {(() => {
                        const totalItems = (dbAddons && dbAddons.length > 0) ? dbAddons.length : 11;
                        const totalAddonPages = Math.ceil(totalItems / addonsPerPage);
                        return totalAddonPages > 1 ? (
                          <div className="flex items-center justify-end space-x-2 pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setAddonPage(prev => Math.max(1, prev - 1));
                                setTimeout(() => {
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }, 50);
                              }}
                              disabled={addonPage === 1}
                              className="p-2 rounded-lg border border-white/10 bg-theatre-dark/40 text-gray-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 cursor-pointer"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-xs text-gray-400 font-sans px-2">
                              Page {addonPage} of {totalAddonPages}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setAddonPage(prev => Math.min(totalAddonPages, prev + 1));
                                setTimeout(() => {
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }, 50);
                              }}
                              disabled={addonPage === totalAddonPages}
                              className="p-2 rounded-lg border border-white/10 bg-theatre-dark/40 text-gray-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 cursor-pointer"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        ) : null;
                      })()}
                    </div>

                    {/* Conditional inputs for LED Numbers or Event Sash */}
                    {(selectedAddons.includes('led_numbers') || selectedAddons.includes('event_sash')) && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4 mt-6 max-w-md"
                      >
                        <h4 className="text-sm font-bold text-white border-b border-white/5 pb-2">Add-on Customizations</h4>

                        {selectedAddons.includes('led_numbers') && (
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-300 block">LED Number(s) Required</label>
                            <input
                              type="text"
                              value={ledNumberText}
                              onChange={(e) => setLedNumberText(e.target.value)}
                              placeholder="E.g., 25 or 18"
                              className="w-full bg-theatre-dark/60 text-white px-4 py-2.5 rounded-xl border border-white/10 focus:border-theatre-gold outline-none text-xs transition-all duration-300 placeholder:text-gray-600"
                            />
                          </div>
                        )}

                        {selectedAddons.includes('event_sash') && (
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-300 block">Sash Occasion</label>
                            <select
                              value={sashOccasion}
                              onChange={(e) => setSashOccasion(e.target.value)}
                              className="w-full bg-theatre-dark text-white px-4 py-2.5 rounded-xl border border-white/10 focus:border-theatre-gold outline-none text-xs transition-all duration-300 cursor-pointer"
                            >
                              <option value="Bride to be">Bride to be</option>
                              <option value="Groom to be">Groom to be</option>
                              <option value="Happy Birthday">Happy Birthday</option>
                              <option value="Congratulations">Congratulations</option>
                              <option value="Mom to be">Mom to be</option>
                              <option value="Father to be">Father to be</option>
                            </select>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                )}

                {/* STEP 9: Payment Gateway */}
                {activeStep === 9 && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-xl font-serif font-bold text-white">Step 9: Pay Advance Amount</h3>
                      <p className="text-xs sm:text-sm text-gray-400">Authorize your ₹1,000 lock deposit using our secure payment options.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                      {/* Payment Method Selector */}
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-300 block">Select Payment Mode</label>
                        <div className="space-y-3">
                          {[
                            { id: 'upi', name: 'UPI (GPay / PhonePe / Paytm)' },
                            { id: 'netbank', name: 'Net Banking' }
                          ].map(method => {
                            const isSelected = paymentMethod === method.id;
                            return (
                              <div
                                key={method.id}
                                onClick={() => setPaymentMethod(method.id)}
                                className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between transition-all duration-300 ${isSelected
                                  ? 'border-theatre-gold bg-theatre-gold/5 text-theatre-gold'
                                  : 'border-white/10 bg-theatre-dark/40 text-gray-400 hover:border-white/20'
                                  }`}
                              >
                                <span className="text-xs font-semibold uppercase tracking-wider">{method.name}</span>
                                <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center ${isSelected ? 'border-theatre-gold text-theatre-gold' : 'border-white/20'
                                  }`}>
                                  {isSelected && <span className="w-2.5 h-2.5 bg-theatre-gold rounded-full" />}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Payment Summary Box */}
                      <div className="bg-theatre-grey-deep/30 border border-white/5 p-6 rounded-2xl flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400">Total Payable:</span>
                            <span className="text-white font-bold text-sm">₹{totalAmount}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm font-bold border-t border-white/5 pt-3">
                            <span className="text-white">Payable Now (Advance):</span>
                            <span className="text-theatre-gold text-lg">₹{advancePaymentRequired}</span>
                          </div>
                          <p className="text-[10px] text-gray-500 font-light leading-relaxed">
                            * The remaining balance of ₹{remainingBalance} is payable at the venue on your event date via card/UPI/cash.
                          </p>
                        </div>

                        <button
                          onClick={handlePayment}
                          disabled={isPaying}
                          className="w-full bg-gradient-to-r from-theatre-gold to-theatre-gold-dark hover:from-theatre-gold-light hover:to-theatre-gold text-theatre-grey-deep font-sans font-bold py-4 rounded-xl shadow-lg hover:shadow-theatre-gold/20 flex items-center justify-center space-x-2 text-sm transition-all duration-300 cursor-pointer disabled:opacity-50"
                        >
                          {isPaying ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin text-theatre-grey-deep" />
                              <span>Processing Secure Payment...</span>
                            </>
                          ) : (
                            <>
                              <CreditCard className="w-4.5 h-4.5 text-theatre-grey-deep" />
                              <span>Pay ₹{advancePaymentRequired} Advance</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}



                {/* STEP 10: Booking Confirmation SUCCESS */}
                {activeStep === 10 && (
                  <div className="max-w-2xl mx-auto pt-1 pb-4 text-center space-y-4">
                    <div className="inline-flex p-4 bg-green-500/10 text-green-400 rounded-full border border-green-500/20">
                      <ShieldCheck className="w-10 h-10" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-serif text-3xl font-bold text-white">Booking Confirmed!</h3>
                      <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
                        Your private screening slot has been locked successfully. Check your registered phone number & email address for your ticket validation copy.
                      </p>
                    </div>

                    <div className="bg-theatre-dark/95 border border-white/10 rounded-2xl p-6 relative max-w-md mx-auto shadow-inner text-left">
                      {/* Ticket punch circles */}
                      <div className="absolute top-1/2 -left-3.5 w-7 h-7 bg-theatre-grey-deep rounded-full -translate-y-1/2 z-10" />
                      <div className="absolute top-1/2 -right-3.5 w-7 h-7 bg-theatre-grey-deep rounded-full -translate-y-1/2 z-10" />

                      <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/5 text-xs">
                        <div>
                          <span className="text-[10px] text-gray-500 block uppercase font-bold mb-1">BOOKING ID</span>
                          <span className="text-sm text-theatre-gold font-sans font-bold">{bookingId}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-500 block uppercase font-bold mb-1">THEATRE SCREEN</span>
                          <span className="text-sm text-white font-sans font-semibold">Screen {selectedScreen}</span>
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
            {activeStep <= 9 && (
              <div className="flex justify-between items-center pt-8 border-t border-white/5 mt-8">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={activeStep === 1}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {activeStep < 9 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={isNextDisabled()}
                    className="inline-flex items-center space-x-1.5 bg-theatre-gold hover:bg-theatre-gold-light text-theatre-grey-deep font-sans text-xs font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-theatre-gold/15 transition-all duration-300 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <span>Proceed Next</span>
                    <ChevronRight className="w-4 h-4 text-theatre-grey-deep" />
                  </button>
                ) : (
                  // <span className="text-xs text-theatre-gold font-sans font-semibold animate-pulse">
                  //   Please authorize payment on right summary panel
                  // </span>
                  <></>
                )}
              </div>
            )}
          </div>

          {/* RIGHT PANEL: Live Invoice/Selected Items Summary (Col Span 4 on large, Hidden in success view) */}
          {activeStep >= 2 && activeStep <= 9 && (
            <div className="col-span-1 lg:col-span-4 bg-theatre-grey-deep/20 backdrop-blur-md border border-white/5 rounded-3xl p-6 space-y-6 sticky top-28">
              <h3 className="font-serif text-lg font-bold text-white border-b border-white/5 pb-2">Booking Summary</h3>

              {/* Selected Slot summary */}
              <div className="space-y-3.5 text-xs font-light text-gray-400">
                <div className="flex justify-between items-center text-sm font-semibold text-white">
                  <span>Selected Screen:</span>
                  <span>{selectedScreen ? `Screen ${selectedScreen}` : 'None'}</span>
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

                  {/* Guests count split by category - only show from Step 4 (Number of People) onwards when guests are selected */}
                  {activeStep >= 4 && totalGuests > 0 && (
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
                          ? `Ages ${cat.from} and above`
                          : `Ages ${cat.from} to ${cat.to} Years`;
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

                {/* Live Itemized Rates Breakdown */}
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
                      <div className="flex flex-col space-y-1 pl-1 text-gray-400">
                        <div className="flex justify-between items-center">
                          <span>Cake ({cakeFlavor}):</span>
                          <span className="text-white">₹{cakeCharges}</span>
                        </div>
                        {cakeMessage && (
                          <div className="text-[10px] text-gray-500 italic pl-2 font-mono break-words leading-relaxed max-w-xs whitespace-pre-wrap">
                            <span className="text-gray-600 not-italic uppercase tracking-wider text-[8px] font-bold block mb-0.5"></span>
                            <span className="text-gray-400">"{cakeMessage}"</span>
                          </div>
                        )}
                      </div>
                    )}
                    {selectedTimeSlot && wantsDecor && (
                      <div className="flex justify-between text-gray-400 pl-2">
                        <span>Decoration :</span>
                        <span className="text-white">₹{decorCharges}</span>
                      </div>
                    )}

                    {/* Add-ons detailed list */}
                    {selectedTimeSlot && selectedAddons.length > 0 && (
                      <div className="space-y-1 pt-1.5 pl-2 border-t border-white/5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Add-ons:</span>
                        {selectedAddons.map(key => {
                          const addon = addonsPrices[key];
                          if (!addon) return null;
                          let name = addon.name;
                          if (key === 'led_numbers' && ledNumberText) {
                            name = `LED Numbers (${ledNumberText})`;
                          } else if (key === 'event_sash' && sashOccasion) {
                            name = `Event Sash (${sashOccasion})`;
                          }
                          return (
                            <div key={key} className="flex justify-between text-[11px] text-gray-400 pl-1 font-mono">
                              <span>+ {name}:</span>
                              <span className="text-white">₹{addon.price}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Total Invoice */}
              <div className="border-t border-dashed border-white/10 pt-4 space-y-2">
                <div className="flex justify-between text-base font-bold text-white border-t border-white/5 pt-2">
                  <span>Total Amount:</span>
                  <span className="text-theatre-gold">₹{selectedTimeSlot ? totalAmount : 0}</span>
                </div>
                <div className="text-[10px] text-gray-500 text-center italic mt-1 font-sans">
                  * All prices are inclusive of GST
                </div>

                {/* Advance details */}
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
    </section>
  );
}
