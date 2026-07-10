import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Tv, 
  Calendar as CalendarIcon, 
  User, 
  Mail, 
  Phone, 
  Users, 
  Sparkles, 
  Cake as CakeIcon, 
  Gift, 
  Camera, 
  Check, 
  ShieldCheck, 
  Heart, 
  Baby, 
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

export default function BookNow({ selectedEventName, clearSelectedEvent }) {
  const navigate = useNavigate();
  
  // Current active step of the wizard (1 to 11)
  const [activeStep, setActiveStep] = useState(1);
  
  // Default Date helper
  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // States representing user inputs
  const [selectedScreen, setSelectedScreen] = useState(null); // 'A' or 'B'
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  
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

  // Guest counts (Split into Adults, Kids 3-10, Kids <3)
  const [guests, setGuests] = useState({
    adults: 0,
    kids3to10: 0,
    kidsBelow3: 0
  });

  const [eventCategory, setEventCategory] = useState(selectedEventName || '');
  
  // Cake customization
  const [wantsCake, setWantsCake] = useState(false);
  const [cakeFlavor, setCakeFlavor] = useState('Chocolate Truffle');
  const [cakeMessage, setCakeMessage] = useState('');
  
  // Decoration package toggle & optional details
  const [wantsDecor, setWantsDecor] = useState(false);

  // Add-ons checklist & details
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [ledNumberText, setLedNumberText] = useState('');
  const [sashOccasion, setSashOccasion] = useState('Bride to be');

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

  // Calculations
  const basePrice = selectedScreen === 'A' ? 2399 : selectedScreen === 'B' ? 1799 : 0;
  const maxCapacity = selectedScreen === 'A' ? 15 : selectedScreen === 'B' ? 6 : 0;
  const totalGuests = Number(guests.adults) + Number(guests.kids3to10) + Number(guests.kidsBelow3);
  
  // Additional guest charges: first 4 adults free, additional adults charged at guestRate
  const additionalAdults = guests.adults > 4 ? guests.adults - 4 : 0;
  const guestRate = selectedScreen === 'A' ? 450 : selectedScreen === 'B' ? 400 : 0;
  const additionalGuestCharges = additionalAdults * guestRate;

  // Kids between 3 to 10 charges
  const kids3to10Rate = selectedScreen === 'A' ? 250 : 200;
  const kids3to10Charges = Number(guests.kids3to10) * kids3to10Rate;

  // Cake flavor prices
  const cakePrices = {
    'Chocolate Truffle': 800,
    'Red Velvet': 900,
    'Butterscotch': 800,
    'Black Forest': 750
  };
  const cakeCharges = wantsCake ? cakePrices[cakeFlavor] || 800 : 0;

  // Decor charges: flat rates inclusive of GST
  const decorCharges = wantsDecor ? (selectedScreen === 'A' ? 900 : 800) : 0;

  // Add-on pricing definitions
  const addonsPrices = {
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
      setOtpSent(true);
      setOtpError('');
    }, 1200);
  };

  const handleVerifyOtp = () => {
    if (customerInfo.otp === '1234') {
      setOtpVerified(true);
      setOtpError('');
      setStepErrors({});
    } else {
      setOtpError('Invalid OTP code. Please enter 1234 for simulation.');
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

    setStepErrors({});
    setActiveStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setStepErrors({});
    setActiveStep(prev => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Mock Payment Action
  const handlePayment = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      
      // Save booked slot to state and localStorage
      const newBooking = {
        screen: selectedScreen,
        date: selectedDate,
        slot: selectedTimeSlot
      };
      const updatedBookings = [...bookedSlots, newBooking];
      setBookedSlots(updatedBookings);
      try {
        localStorage.setItem('tiny_theatre_booked_slots', JSON.stringify(updatedBookings));
      } catch (err) {
        console.error(err);
      }

      // Generate random booking code
      const code = `TT-${Math.floor(10000 + Math.random() * 90000)}`;
      setBookingId(code);
      
      // Navigate to success state (Step 10)
      setActiveStep(10);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Trigger Confetti
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#F4C430', '#14C299', '#ffffff']
      });
    }, 2000);
  };

  // Reset Booking Form
  const handleReset = () => {
    setActiveStep(1);
    setSelectedScreen(null);
    setSelectedDate(getTodayDateString());
    setSelectedTimeSlot('');
    setCustomerInfo({ fullName: '', email: '', phone: '', otp: '' });
    setOtpSent(false);
    setOtpVerified(false);
    setGuests({ adults: 0, kids3to10: 0, kidsBelow3: 0 });
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
    <section id="book-now" className={`relative bg-theatre-dark/95 overflow-hidden min-h-screen transition-all duration-500 ${
      activeStep === 10 ? 'py-6 md:py-8' : 'py-16'
    }`}>
      {/* Visual backgrounds */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-theatre-grey/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-theatre-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[85rem] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Header */}
       

        {activeStep <= 9 && (
          /* horizontal Progress Steps Bar */
          <div className="max-w-5xl mx-auto mb-12 overflow-x-auto pb-4 scrollbar-thin">
            <div className="flex items-center justify-between min-w-[700px] px-4">
              {stepNames.map((name, index) => {
                const stepNum = index + 1;
                const isCompleted = activeStep > stepNum;
                const isActive = activeStep === stepNum;
                return (
                  <div key={name} className="flex items-center flex-grow last:flex-grow-0">
                    <div className="flex flex-col items-center relative">
                      <div 
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-sans text-xs font-bold transition-all duration-300 border ${
                          isCompleted 
                            ? 'bg-theatre-gold border-theatre-gold text-theatre-grey-deep'
                            : isActive 
                            ? 'bg-transparent border-theatre-gold text-theatre-gold shadow-md shadow-theatre-gold/20 scale-110'
                            : 'bg-theatre-grey-deep/30 border-white/10 text-gray-500'
                        }`}
                      >
                        {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
                      </div>
                      <span className={`text-[10px] mt-2 font-medium tracking-wide uppercase transition-colors duration-300 ${
                        isActive ? 'text-theatre-gold' : 'text-gray-500'
                      }`}>
                        {name}
                      </span>
                    </div>
                    {index < stepNames.length - 1 && (
                      <div className={`h-0.5 flex-grow mx-4 rounded-full transition-colors duration-500 ${
                        isCompleted ? 'bg-theatre-gold/60' : 'bg-white/5'
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
          <div className={`col-span-1 lg:col-span-8 bg-theatre-grey-deep/20 backdrop-blur-md border border-white/5 rounded-3xl flex flex-col justify-between transition-all duration-300 ${
            activeStep === 10
              ? 'p-4 sm:p-6 pt-2 sm:pt-2 lg:col-span-12 min-h-0'
              : `p-6 sm:p-8 ${
                  (activeStep === 6 && !wantsCake) || activeStep === 7
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
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-xl font-serif font-bold text-white">Step 1: Select Screen</h3>
                      <p className="text-xs sm:text-sm text-gray-400">Choose between our premium private theatre halls based on seating capacity.</p>
                    </div>
                    
                    {stepErrors.screen && (
                      <div className="p-3.5 bg-red-950/30 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center space-x-2">
                        <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
                        <span>{stepErrors.screen}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                      {/* Screen A Card */}
                      <div 
                        onClick={() => { setSelectedScreen('A'); setStepErrors({}); }}
                        className={`rounded-2xl overflow-hidden bg-theatre-dark/40 border cursor-pointer group transition-all duration-300 flex flex-col ${
                          selectedScreen === 'A' 
                            ? 'border-theatre-gold shadow-lg shadow-theatre-gold/15 scale-[1.01]' 
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="relative h-44 overflow-hidden bg-gray-900">
                          <img 
                            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80" 
                            alt="Screen A Grand Hall" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-3 left-3 px-3 py-1 bg-theatre-gold text-theatre-grey-deep font-sans text-[10px] font-black uppercase rounded-full">
                            Grand Hall
                          </span>
                        </div>
                        <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                          <div className="space-y-1.5">
                            <h4 className="text-base sm:text-lg font-serif font-bold text-white">Screen A</h4>
                            <p className="text-xs text-gray-400 font-light leading-relaxed">Ideal for large group movie nights, reunions, and grand parties.</p>
                          </div>
                          <div className="space-y-2 border-t border-white/5 pt-3">
                            <div className="flex justify-between items-baseline text-xs">
                              <span className="text-gray-500 mr-2">Capacity:</span>
                              <span className="text-white font-semibold whitespace-nowrap text-right">Upto 15 Members</span>
                            </div>
                            <div className="flex justify-between items-baseline text-xs">
                              <span className="text-gray-500 mr-2">Base Price (covers 4 members):</span>
                              <span className="text-theatre-gold font-bold whitespace-nowrap text-right">₹2,399 (Inc. GST)</span>
                            </div>
                            <div className="flex justify-between items-baseline text-xs">
                              <span className="text-gray-500 mr-2">Extra Guest (above 4):</span>
                              <span className="text-white whitespace-nowrap text-right">₹450 / each (Inc. GST)</span>
                            </div>
                            <div className="flex justify-between items-baseline text-xs">
                              <span className="text-gray-500 mr-2">Kids (Below 3 years):</span>
                              <span className="text-green-500 font-bold whitespace-nowrap text-right">Free</span>
                            </div>
                            <div className="flex justify-between items-baseline text-xs">
                              <span className="text-gray-500 mr-2">Kids (3 to 10 years):</span>
                              <span className="text-white whitespace-nowrap text-right">₹250 / each</span>
                            </div>
                          </div>
                          

                          <button 
                            className={`w-full py-2.5 rounded-xl font-sans text-xs font-bold transition-all duration-300 ${
                              selectedScreen === 'A'
                                ? 'bg-theatre-gold text-theatre-grey-deep shadow-md'
                                : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                            }`}
                          >
                            {selectedScreen === 'A' ? 'Selected' : 'Select Screen'}
                          </button>
                        </div>
                      </div>

                      {/* Screen B Card */}
                      <div 
                        onClick={() => { setSelectedScreen('B'); setStepErrors({}); }}
                        className={`rounded-2xl overflow-hidden bg-theatre-dark/40 border cursor-pointer group transition-all duration-300 flex flex-col ${
                          selectedScreen === 'B' 
                            ? 'border-theatre-gold shadow-lg shadow-theatre-gold/15 scale-[1.01]' 
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="relative h-44 overflow-hidden bg-gray-900">
                          <img 
                            src="https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=400&q=80" 
                            alt="Screen B Cozy Suite" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-3 left-3 px-3 py-1 bg-theatre-gold text-theatre-grey-deep font-sans text-[10px] font-black uppercase rounded-full">
                            Cozy Suite
                          </span>
                        </div>
                        <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                          <div className="space-y-1.5">
                            <h4 className="text-base sm:text-lg font-serif font-bold text-white">Screen B</h4>
                            <p className="text-xs text-gray-400 font-light leading-relaxed">Perfect for intimate date nights, couples, and small family gatherings.</p>
                          </div>
                          <div className="space-y-2 border-t border-white/5 pt-3">
                            <div className="flex justify-between items-baseline text-xs">
                              <span className="text-gray-500 mr-2">Capacity:</span>
                              <span className="text-white font-semibold whitespace-nowrap text-right">Upto 6 Members</span>
                            </div>
                            <div className="flex justify-between items-baseline text-xs">
                              <span className="text-gray-500 mr-2">Base Price (covers 4 members):</span>
                              <span className="text-theatre-gold font-bold whitespace-nowrap text-right">₹1,799 (Inc. GST)</span>
                            </div>
                            <div className="flex justify-between items-baseline text-xs">
                              <span className="text-gray-500 mr-2">Extra Guest (above 4):</span>
                              <span className="text-white whitespace-nowrap text-right">₹400 / each (Inc. GST)</span>
                            </div>
                            <div className="flex justify-between items-baseline text-xs">
                              <span className="text-gray-500 mr-2">Kids (Below 3 years):</span>
                              <span className="text-green-500 font-bold whitespace-nowrap text-right">Free</span>
                            </div>
                            <div className="flex justify-between items-baseline text-xs">
                              <span className="text-gray-500 mr-2">Kids (3 to 10 years):</span>
                              <span className="text-white whitespace-nowrap text-right">₹200 / each</span>
                            </div>
                          </div>

                          <button 
                            className={`w-full py-2.5 rounded-xl font-sans text-xs font-bold transition-all duration-300 ${
                              selectedScreen === 'B'
                                ? 'bg-theatre-gold text-theatre-grey-deep shadow-md'
                                : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                            }`}
                          >
                            {selectedScreen === 'B' ? 'Selected' : 'Select Screen'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Overall pricing info footnote */}
                    <div className="p-4 bg-theatre-gold/5 rounded-2xl border border-theatre-gold/20 text-center">
                      <p className="text-xs text-theatre-gold font-sans font-medium">
                        ★ Note: All prices shown above are fully <strong>Inclusive of GST</strong>. No extra taxes will be added at checkout.
                      </p>
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
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-300 block">Available Slots</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            '9:00 AM to 12 PM (3 hours)',
                            '12:30 PM to 3:30 PM (3 hours)',
                            '4:00 PM to 7:00 PM (3 hours)',
                            '7:30 PM to 10:30 PM (3 hours)',
                            '11:00 PM to 2:00 AM (3 hours)'
                          ].map(slot => {
                            const isSelected = selectedTimeSlot === slot;
                            const isBooked = bookedSlots.some(b => 
                              b.screen === selectedScreen && 
                              b.date === selectedDate && 
                              b.slot === slot
                            );
                            return (
                              <button
                                key={slot}
                                onClick={() => { 
                                  if (!isBooked) {
                                    setSelectedTimeSlot(slot); 
                                    setStepErrors({}); 
                                  }
                                }}
                                disabled={isBooked}
                                className={`py-3 px-4 rounded-xl text-left border transition-all duration-300 text-xs font-sans ${
                                  isSelected
                                    ? 'border-theatre-gold bg-theatre-gold/10 text-theatre-gold shadow-md'
                                    : isBooked
                                      ? 'border-red-500/25 bg-red-950/15 text-gray-500 cursor-not-allowed opacity-50'
                                      : 'border-white/10 bg-theatre-dark/40 text-gray-300 hover:border-white/20'
                                }`}
                              >
                                <div className="font-bold mb-1">{slot}</div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-widest flex items-center justify-between">
                                  <span>Slot Timing</span>
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
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-theatre-gold/10 border border-theatre-gold/20 rounded-xl flex items-center justify-between mt-4"
                      >
                        <div className="flex items-center space-x-3 text-sm text-gray-300">
                          <CalendarIcon className="w-5 h-5 text-theatre-gold" />
                          <div>
                            <span className="font-semibold text-white block">Selected Slot Summary</span>
                            <span className="text-xs">{selectedDate} @ {selectedTimeSlot}</span>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 bg-green-500/25 border border-green-500/30 text-green-400 rounded-full font-bold uppercase tracking-wider">
                          Reserved
                        </span>
                      </motion.div>
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
                              maxLength={4}
                              disabled={!otpSent || otpVerified}
                              value={customerInfo.otp}
                              onChange={(e) => setCustomerInfo({ ...customerInfo, otp: e.target.value })}
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
                          <p className="text-theatre-gold text-[10px] tracking-wide mt-1 animate-pulse">
                            Tip: For simulation, use OTP code: <b>1234</b>
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
                      {/* Adults count */}
                      <div className="flex items-center justify-between bg-theatre-dark/40 p-4 border border-white/5 rounded-2xl">
                        <div className="space-y-0.5">
                          <span className="text-sm font-semibold text-white block">Adults</span>
                          <span className="text-xs text-gray-500">Ages 11 and above</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <button 
                            onClick={() => setGuests({ ...guests, adults: Math.max(0, guests.adults - 1) })}
                            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center font-bold text-lg cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-sans font-bold text-base w-6 text-center text-white">{guests.adults}</span>
                          <button 
                            onClick={() => setGuests({ ...guests, adults: guests.adults + 1 })}
                            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center font-bold text-lg cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Kids 3-10 count */}
                      <div className="flex items-center justify-between bg-theatre-dark/40 p-4 border border-white/5 rounded-2xl">
                        <div className="space-y-0.5">
                          <span className="text-sm font-semibold text-white block">Kids (3 to 10 Years)</span>
                          <span className="text-xs text-gray-500">₹{selectedScreen === 'A' ? 250 : 200} / each</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <button 
                            onClick={() => setGuests({ ...guests, kids3to10: Math.max(0, guests.kids3to10 - 1) })}
                            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center font-bold text-lg cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-sans font-bold text-base w-6 text-center text-white">{guests.kids3to10}</span>
                          <button 
                            onClick={() => setGuests({ ...guests, kids3to10: guests.kids3to10 + 1 })}
                            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center font-bold text-lg cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Kids Below 3 count */}
                      <div className="flex items-center justify-between bg-theatre-dark/40 p-4 border border-white/5 rounded-2xl">
                        <div className="space-y-0.5">
                          <span className="text-sm font-semibold text-white block">Kids (Below 3 Years)</span>
                          <span className="text-xs text-green-500 font-bold">Free</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <button 
                            onClick={() => setGuests({ ...guests, kidsBelow3: Math.max(0, guests.kidsBelow3 - 1) })}
                            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center font-bold text-lg cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-sans font-bold text-base w-6 text-center text-white">{guests.kidsBelow3}</span>
                          <button 
                            onClick={() => setGuests({ ...guests, kidsBelow3: guests.kidsBelow3 + 1 })}
                            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center font-bold text-lg cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

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
                      {[
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
                      ].map(cat => {
                        const isSelected = eventCategory === cat.name;
                        return (
                          <div
                            key={cat.name}
                            onClick={() => setEventCategory(cat.name)}
                            className="flex flex-col items-center cursor-pointer group select-none"
                          >
                            {/* Image Container (h-36 size, no golden outline, clean white/gray borders) */}
                            <div className={`relative w-full h-36 rounded-2xl overflow-hidden transition-all duration-300 border bg-theatre-dark/40 ${
                              isSelected
                                ? 'border-white/40 shadow-lg shadow-white/5'
                                : 'border-white/10 hover:border-white/20'
                            }`}>
                              <img 
                                src={cat.image} 
                                alt={cat.name}
                                className={`w-full h-full object-cover transition-transform duration-500 ${
                                  isSelected ? 'scale-105' : 'group-hover:scale-105'
                                }`}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = cat.fallback;
                                }}
                              />
                            </div>
                            
                            {/* Occasion text underneath - fixed height to prevent layout shifts */}
                            <span className={`mt-2.5 text-[10px] font-sans font-bold uppercase tracking-wider text-center h-8 flex items-center justify-center transition-colors duration-300 ${
                              isSelected ? 'text-theatre-gold font-extrabold' : 'text-gray-400 group-hover:text-white'
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
                          className={`px-6 py-3 rounded-xl border text-xs font-sans font-bold tracking-wider transition-all duration-300 cursor-pointer ${
                            wantsCake 
                              ? 'bg-theatre-gold border-theatre-gold text-theatre-grey-deep'
                              : 'bg-white/5 border-white/10 text-gray-300'
                          }`}
                        >
                          Yes, Include Cake
                        </button>
                        <button
                          onClick={() => setWantsCake(false)}
                          className={`px-6 py-3 rounded-xl border text-xs font-sans font-bold tracking-wider transition-all duration-300 cursor-pointer ${
                            !wantsCake 
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
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                              { flavor: 'Chocolate Truffle', price: '₹800', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=80' },
                              { flavor: 'Red Velvet', price: '₹900', img: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=300&q=80' },
                              { flavor: 'Butterscotch', price: '₹800', img: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=300&q=80' },
                              { flavor: 'Black Forest', price: '₹750', img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=300&q=80' }
                            ].map(cake => {
                              const isSelected = cakeFlavor === cake.flavor;
                              return (
                                <div
                                  key={cake.flavor}
                                  onClick={() => setCakeFlavor(cake.flavor)}
                                  className={`rounded-xl overflow-hidden border cursor-pointer bg-theatre-dark/40 transition-all duration-300 ${
                                    isSelected 
                                      ? 'border-theatre-gold shadow-md shadow-theatre-gold/10 scale-102' 
                                      : 'border-white/10 hover:border-white/20'
                                  }`}
                                >
                                  <div className="h-24 bg-gray-900 overflow-hidden">
                                    <img src={cake.img} alt={cake.flavor} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="p-3 text-center space-y-1">
                                    <h4 className="text-xs font-bold text-white truncate">{cake.flavor}</h4>
                                    <span className="text-xs text-theatre-gold font-bold">{cake.price}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

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
                          className={`px-6 py-3 rounded-xl border text-xs font-sans font-bold tracking-wider transition-all duration-300 cursor-pointer ${
                            wantsDecor 
                              ? 'bg-theatre-gold border-theatre-gold text-theatre-grey-deep'
                              : 'bg-white/5 border-white/10 text-gray-300'
                          }`}
                        >
                          Yes, Include Decor
                        </button>
                        <button
                          onClick={() => setWantsDecor(false)}
                          className={`px-6 py-3 rounded-xl border text-xs font-sans font-bold tracking-wider transition-all duration-300 cursor-pointer ${
                            !wantsDecor 
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

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
                      {[
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
                      ].map(addon => {
                        const Icon = addon.icon;
                        const isSelected = selectedAddons.includes(addon.key);
                        return (
                          <div
                            key={addon.key}
                            onClick={() => toggleAddon(addon.key)}
                            className={`p-4 rounded-xl border cursor-pointer flex flex-col justify-between min-h-[120px] transition-all duration-300 ${
                              isSelected
                                ? 'border-theatre-gold bg-theatre-gold/10 text-theatre-gold scale-102'
                                : 'border-white/10 bg-theatre-dark/40 text-gray-400 hover:border-white/20'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="p-2 bg-white/5 rounded-lg text-gray-300">
                                <Icon className="w-4.5 h-4.5" />
                              </div>
                              {isSelected && (
                                <span className="w-4 h-4 rounded-full bg-theatre-gold text-theatre-grey-deep flex items-center justify-center">
                                  <Check className="w-2.5 h-2.5" />
                                </span>
                              )}
                            </div>
                            <div className="space-y-1 mt-3">
                              <h4 className="text-xs font-bold text-white">{addon.name}</h4>
                              <span className="text-[11px] text-theatre-gold font-bold">{addon.price}</span>
                            </div>
                          </div>
                        );
                      })}
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
                                className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between transition-all duration-300 ${
                                  isSelected
                                    ? 'border-theatre-gold bg-theatre-gold/5 text-theatre-gold'
                                    : 'border-white/10 bg-theatre-dark/40 text-gray-400 hover:border-white/20'
                                }`}
                              >
                                <span className="text-xs font-semibold uppercase tracking-wider">{method.name}</span>
                                <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center ${
                                  isSelected ? 'border-theatre-gold text-theatre-gold' : 'border-white/20'
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
                          <span className="text-sm text-white font-sans font-semibold">{selectedDate}</span>
                          <span className="text-[10px] text-gray-400 block mt-0.5">{selectedTimeSlot}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-500 block uppercase font-bold mb-1">GUEST BREAKDOWN</span>
                          <span className="text-sm text-white font-sans font-semibold block">{totalGuests} Total</span>
                          <div className="text-[9px] text-gray-400 mt-1 space-y-0.5 leading-none font-sans font-light">
                            <div>Adults: {guests.adults}</div>
                            <div>Kids (3-10 Yrs): {guests.kids3to10}</div>
                            <div>Kids (Below 3 Yrs): {guests.kidsBelow3}</div>
                          </div>
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
          {activeStep <= 9 && (
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
                    <span className="text-white">{selectedDate || 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="flex-shrink-0">Time Slot:</span>
                    <span className="text-white text-right font-medium pl-4">{selectedTimeSlot || 'Not selected'}</span>
                  </div>
                  
                  {/* Guests count split 1-by-1 rows */}
                  <div className="space-y-1.5 py-2 border-t border-b border-white/5 my-1.5">
                    <div className="flex justify-between font-semibold text-gray-300">
                      <span>Total Guests:</span>
                      <span className="text-white">{totalGuests}</span>
                    </div>
                    {totalGuests > 0 && (
                      <>
                        <div className="flex justify-between text-[11px] text-gray-400 pl-3">
                          <span>Adults:</span>
                          <span className="text-white font-medium">{guests.adults}</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-gray-400 pl-3">
                          <span>Kids (3 to 10 Years):</span>
                          <span className="text-white font-medium">{guests.kids3to10}</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-gray-400 pl-3">
                          <span>Kids (Below 3 Years):</span>
                          <span className="text-white font-medium">{guests.kidsBelow3}</span>
                        </div>
                      </>
                    )}
                  </div>

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
                      <span className="text-white">₹{basePrice}</span>
                    </div>
                    {additionalGuestCharges > 0 && (
                      <div className="flex justify-between text-gray-400 pl-2">
                        <span>Extra Adults ({additionalAdults} * ₹{guestRate}):</span>
                        <span className="text-white">₹{additionalGuestCharges}</span>
                      </div>
                    )}
                    {kids3to10Charges > 0 && (
                      <div className="flex justify-between text-gray-400 pl-2">
                        <span>Kids 3-10 ({guests.kids3to10} * ₹{kids3to10Rate}):</span>
                        <span className="text-white">₹{kids3to10Charges}</span>
                      </div>
                    )}
                    {wantsCake && (
                      <div className="flex flex-col space-y-0.5 pl-2 text-gray-400">
                        <div className="flex justify-between">
                          <span>Cake Arrangement ({cakeFlavor}):</span>
                          <span className="text-white">₹{cakeCharges}</span>
                        </div>
                        {cakeMessage && (
                          <span className="text-[10px] text-gray-500 italic pl-2 font-mono">Message: "{cakeMessage}"</span>
                        )}
                      </div>
                    )}
                    {wantsDecor && (
                      <div className="flex justify-between text-gray-400 pl-2">
                        <span>Decoration :</span>
                        <span className="text-white">₹{decorCharges}</span>
                      </div>
                    )}
                    
                    {/* Add-ons detailed list */}
                    {selectedAddons.length > 0 && (
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
                  <span className="text-theatre-gold">₹{totalAmount}</span>
                </div>
                <div className="text-[10px] text-gray-500 text-center italic mt-1 font-sans">
                  * All prices are inclusive of GST
                </div>
                
                {/* Advance details */}
                <div className="bg-theatre-gold/10 p-3 rounded-xl border border-theatre-gold/25 mt-4 space-y-1 text-center font-sans">
                  <span className="text-[10px] text-gray-400 block uppercase font-bold">Lock Deposit Required</span>
                  <span className="text-lg font-bold text-theatre-gold block">₹{advancePaymentRequired}</span>
                  <span className="text-[9px] text-gray-500 block leading-tight">Payable online to secure slot</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
