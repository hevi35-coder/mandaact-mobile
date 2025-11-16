import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { supabase } from '@/services/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/feedback/Toast';

interface SignupScreenProps {
  navigation: any;
}

export default function SignupScreen({ navigation }: SignupScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      showToast('error', '모든 필드를 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      showToast('error', '비밀번호가 일치하지 않습니다.');
      return;
    }

    if (password.length < 6) {
      showToast('error', '비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        showToast('error', error.message);
      } else {
        showToast('success', '회원가입 성공! 이메일을 확인하여 인증을 완료해주세요.');
        setTimeout(() => navigation.navigate('Login'), 1500);
      }
    } catch (error) {
      showToast('error', '회원가입 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center items-center p-5">
          <Text className="text-4xl font-bold text-sky-500 mb-2">회원가입</Text>
          <Text className="text-base text-gray-600 mb-10">MandaAct 계정 만들기</Text>

          <View className="w-full max-w-sm">
            <Input
              placeholder="이메일"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <Input
              placeholder="비밀번호 (최소 6자)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password-new"
              className="mt-4"
            />

            <Input
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoComplete="password-new"
              className="mt-4"
            />

            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              onPress={handleSignup}
              disabled={loading}
              className="mt-6"
            >
              회원가입
            </Button>

            <Button
              variant="ghost"
              size="md"
              fullWidth
              onPress={() => navigation.navigate('Login')}
              className="mt-4"
            >
              이미 계정이 있으신가요? 로그인
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}