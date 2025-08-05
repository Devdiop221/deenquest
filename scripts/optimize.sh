#!/bin/bash

# DeenQuest Production Optimization Script
echo "🚀 Optimizing DeenQuest for production..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Optimize server
print_step "Optimizing server..."
cd apps/server

# Clean and install dependencies
bun install --frozen-lockfile --production

# Build optimized version
bun run build

print_success "Server optimized"

# Optimize mobile app
print_step "Optimizing mobile app..."
cd ../native

# Clean cache
rm -rf .expo
rm -rf node_modules/.cache

# Install dependencies
bun install --frozen-lockfile

# Optimize assets
print_step "Optimizing assets..."

# Create optimized icons if they don't exist
if [ ! -f "assets/icon.png" ]; then
    echo "⚠️  Warning: assets/icon.png not found. Please add your app icon."
fi

if [ ! -f "assets/splash.png" ]; then
    echo "⚠️  Warning: assets/splash.png not found. Please add your splash screen."
fi

# Check bundle size
print_step "Analyzing bundle size..."
npx expo export --platform all --output-dir dist-check
du -sh dist-check
rm -rf dist-check

print_success "Mobile app optimized"

cd ../..

# Generate production checklist
print_step "Generating production checklist..."

cat > PRODUCTION_CHECKLIST.md << 'EOF'
# DeenQuest - Production Checklist

## Pre-deployment

### Server
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates valid
- [ ] Rate limiting configured
- [ ] Monitoring enabled
- [ ] Backup strategy in place

### Mobile App
- [ ] App icons added (1024x1024)
- [ ] Splash screens added
- [ ] App store metadata ready
- [ ] Privacy policy updated
- [ ] Terms of service updated
- [ ] Push notification certificates (if used)

### Security
- [ ] Secrets rotated
- [ ] CORS configured correctly
- [ ] Rate limiting tested
- [ ] Input validation verified
- [ ] Authentication flows tested

### Performance
- [ ] Bundle size optimized (< 50MB)
- [ ] API response times < 2s
- [ ] Database queries optimized
- [ ] Images compressed
- [ ] Caching configured

### Testing
- [ ] All tests passing
- [ ] Manual testing completed
- [ ] Performance testing done
- [ ] Security testing done
- [ ] Accessibility testing done

## Post-deployment

### Monitoring
- [ ] Health checks working
- [ ] Error tracking active
- [ ] Performance monitoring active
- [ ] User analytics configured

### App Stores
- [ ] iOS app submitted (if applicable)
- [ ] Android app submitted (if applicable)
- [ ] Store listings optimized
- [ ] Screenshots updated

### Documentation
- [ ] API documentation updated
- [ ] User documentation updated
- [ ] Deployment guide updated
- [ ] Troubleshooting guide updated

## Launch Day

### Communication
- [ ] Team notified
- [ ] Users notified (if update)
- [ ] Social media posts ready
- [ ] Press release ready (if major launch)

### Monitoring
- [ ] Monitor error rates
- [ ] Monitor performance
- [ ] Monitor user feedback
- [ ] Be ready for hotfixes

## Post-Launch

### Week 1
- [ ] Monitor crash reports
- [ ] Collect user feedback
- [ ] Monitor app store reviews
- [ ] Plan first update

### Month 1
- [ ] Analyze usage patterns
- [ ] Plan feature roadmap
- [ ] Optimize based on data
- [ ] Scale infrastructure if needed
EOF

print_success "Production checklist generated"

# Final summary
echo ""
echo "🎉 Optimization complete!"
echo ""
echo "📋 Next steps:"
echo "1. Review PRODUCTION_CHECKLIST.md"
echo "2. Test the optimized build locally"
echo "3. Deploy to staging first"
echo "4. Run final tests"
echo "5. Deploy to production"
echo ""
echo "📊 Bundle sizes:"
echo "- Server: $(du -sh apps/server/dist 2>/dev/null || echo 'Not built')"
echo "- Mobile: Run 'expo export' to check"