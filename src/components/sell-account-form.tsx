import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Shield, Info } from 'lucide-react';
import { createListing } from '../utils/api';

interface SellAccountFormProps {
  darkMode: boolean;
  onClose: () => void;
  onCreated: () => Promise<void> | void;
}

export function SellAccountForm({ darkMode, onClose, onCreated }: SellAccountFormProps) {
  const [formData, setFormData] = useState({
    game: 'Valorant',
    region: '',
    level: '',
    rank: '',
    skins: '',
    agents: '',
    emailChangeable: false,
    price: '',
    negotiable: false,
    description: '',
    deliveryEmail: '',
    deliveryPassword: '',
    deliveryCode: '',
    agreeTerms: false,
    confirmOwnership: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: string, value: string | boolean) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.region || !formData.level || !formData.rank || !formData.price) {
      setError('Please fill in region, level, rank, and price before publishing.');
      return;
    }

    if (!formData.deliveryEmail || !formData.deliveryPassword) {
      setError('Transfer email and transfer password are required so the buyer can receive access.');
      return;
    }

    if (!formData.agreeTerms || !formData.confirmOwnership) {
      setError('Please accept the terms and confirm ownership to continue.');
      return;
    }

    setIsSubmitting(true);

    try {
      await createListing({
        region: formData.region,
        level: Number(formData.level),
        rank: formData.rank,
        skins: Number(formData.skins || 0),
        agents: formData.agents,
        emailChangeable: formData.emailChangeable,
        price: Number(formData.price),
        negotiable: formData.negotiable,
        description: formData.description,
        deliveryEmail: formData.deliveryEmail,
        deliveryPassword: formData.deliveryPassword,
        deliveryCode: formData.deliveryCode || undefined,
      });

      setSuccess('Listing published successfully. It is now live in the marketplace.');
      await onCreated();
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : 'Failed to publish listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <motion.button
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg mb-6 transition-all ${
              darkMode 
                ? 'text-gray-400 hover:text-white hover:bg-white/10' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Marketplace</span>
          </motion.button>

          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Sell Your Account
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Publish a real listing to Neon and make it available for secure checkout.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className={`p-6 rounded-2xl backdrop-blur-xl border ${darkMode ? 'bg-[#0d0d0d]/60 border-white/10' : 'bg-white/60 border-gray-300/30'}`}>
            <h2 className={`text-2xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Account Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Game</label>
                <input
                  value={formData.game}
                  disabled
                  className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-black/40 border-white/10 text-gray-400' : 'bg-gray-100 border-gray-300 text-gray-600'}`}
                />
              </div>
              <div>
                <label className={`block text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Region / Server</label>
                <select
                  value={formData.region}
                  onChange={(event) => updateField('region', event.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border outline-none ${darkMode ? 'bg-black/40 border-white/10 text-white focus:border-cyan-500' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-600'}`}
                >
                  <option value="">Select Region</option>
                  <option>NA</option>
                  <option>EU</option>
                  <option>APAC</option>
                  <option>LATAM</option>
                  <option>BR</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Account Level</label>
                <input
                  type="number"
                  value={formData.level}
                  onChange={(event) => updateField('level', event.target.value)}
                  placeholder="150"
                  className={`w-full px-4 py-3 rounded-lg border outline-none ${darkMode ? 'bg-black/40 border-white/10 text-white focus:border-cyan-500' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-600'}`}
                />
              </div>
              <div>
                <label className={`block text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Current Rank</label>
                <input
                  value={formData.rank}
                  onChange={(event) => updateField('rank', event.target.value)}
                  placeholder="Immortal 2"
                  className={`w-full px-4 py-3 rounded-lg border outline-none ${darkMode ? 'bg-black/40 border-white/10 text-white focus:border-cyan-500' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-600'}`}
                />
              </div>
              <div>
                <label className={`block text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Number of Skins</label>
                <input
                  type="number"
                  value={formData.skins}
                  onChange={(event) => updateField('skins', event.target.value)}
                  placeholder="47"
                  className={`w-full px-4 py-3 rounded-lg border outline-none ${darkMode ? 'bg-black/40 border-white/10 text-white focus:border-cyan-500' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-600'}`}
                />
              </div>
              <div>
                <label className={`block text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Agents Unlocked</label>
                <input
                  value={formData.agents}
                  onChange={(event) => updateField('agents', event.target.value)}
                  placeholder="All Agents"
                  className={`w-full px-4 py-3 rounded-lg border outline-none ${darkMode ? 'bg-black/40 border-white/10 text-white focus:border-cyan-500' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-600'}`}
                />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <input
                type="checkbox"
                id="emailChangeable"
                checked={formData.emailChangeable}
                onChange={(event) => updateField('emailChangeable', event.target.checked)}
                className="w-5 h-5 rounded border-2 border-cyan-500"
              />
              <label htmlFor="emailChangeable" className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email is changeable for the buyer
              </label>
            </div>
          </div>

          <div className={`p-6 rounded-2xl backdrop-blur-xl border ${darkMode ? 'bg-[#0d0d0d]/60 border-white/10' : 'bg-white/60 border-gray-300/30'}`}>
            <h2 className={`text-2xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Pricing & Description</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Listing Price (INR)</label>
                <div className="relative">
                  <span className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>₹</span>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(event) => updateField('price', event.target.value)}
                    placeholder="15000"
                    className={`w-full pl-8 pr-4 py-3 rounded-lg border outline-none ${darkMode ? 'bg-black/40 border-white/10 text-white focus:border-cyan-500' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-600'}`}
                  />
                </div>
              </div>
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-blue-500/10 border border-blue-500/20'}`}>
                <div className="flex items-start gap-2">
                  <Info size={18} className={darkMode ? 'text-cyan-400 mt-0.5' : 'text-blue-600 mt-0.5'} />
                  <div>
                    <p className={`text-sm font-semibold ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>Market Suggestion</p>
                    <p className="text-xs text-gray-400 mt-1">Similar accounts currently land in the ₹12,000 to ₹18,000 range.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <input
                type="checkbox"
                id="negotiable"
                checked={formData.negotiable}
                onChange={(event) => updateField('negotiable', event.target.checked)}
                className="w-5 h-5 rounded border-2 border-cyan-500"
              />
              <label htmlFor="negotiable" className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Price is negotiable
              </label>
            </div>
            <textarea
              value={formData.description}
              onChange={(event) => updateField('description', event.target.value)}
              placeholder="Describe what makes this listing valuable."
              rows={5}
              className={`mt-4 w-full px-4 py-3 rounded-lg border outline-none resize-none ${darkMode ? 'bg-black/40 border-white/10 text-white focus:border-cyan-500' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-600'}`}
            />
          </div>

          <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-gradient-to-br from-cyan-500/10 to-purple-600/10 border-cyan-500/20' : 'bg-gradient-to-br from-blue-500/10 to-purple-600/10 border-blue-500/20'}`}>
            <div className="flex items-start gap-4">
              <Shield className={darkMode ? 'text-cyan-400 flex-shrink-0' : 'text-blue-600 flex-shrink-0'} size={32} />
              <div className="flex-1">
                <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>Secure Delivery Details</h3>
                <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  These credentials are stored so the buyer can receive access after checkout. For a production launch, these should move into encrypted secret storage.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    value={formData.deliveryEmail}
                    onChange={(event) => updateField('deliveryEmail', event.target.value)}
                    placeholder="Transfer email"
                    className={`px-4 py-3 rounded-lg border outline-none ${darkMode ? 'bg-black/40 border-white/10 text-white focus:border-cyan-500' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-600'}`}
                  />
                  <input
                    value={formData.deliveryPassword}
                    onChange={(event) => updateField('deliveryPassword', event.target.value)}
                    placeholder="Transfer password"
                    className={`px-4 py-3 rounded-lg border outline-none ${darkMode ? 'bg-black/40 border-white/10 text-white focus:border-cyan-500' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-600'}`}
                  />
                  <input
                    value={formData.deliveryCode}
                    onChange={(event) => updateField('deliveryCode', event.target.value)}
                    placeholder="Security code (optional)"
                    className={`px-4 py-3 rounded-lg border outline-none ${darkMode ? 'bg-black/40 border-white/10 text-white focus:border-cyan-500' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-600'}`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className={`flex items-start gap-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <input
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={(event) => updateField('agreeTerms', event.target.checked)}
                className="mt-0.5 w-5 h-5 rounded border-2 border-cyan-500"
              />
              <span>I agree to GameXchange's seller rules and understand inaccurate listings may be removed.</span>
            </label>
            <label className={`flex items-start gap-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <input
                type="checkbox"
                checked={formData.confirmOwnership}
                onChange={(event) => updateField('confirmOwnership', event.target.checked)}
                className="mt-0.5 w-5 h-5 rounded border-2 border-cyan-500"
              />
              <span>I confirm that I own this account and have authority to transfer it.</span>
            </label>
          </div>

          {error && <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}
          {success && <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">{success}</div>}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold text-lg shadow-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all disabled:opacity-60"
            >
              {isSubmitting ? 'Publishing Listing...' : 'Publish Listing'}
            </motion.button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
}
